<?php

namespace App\Models;

use Firebase\JWT\JWT;
use GuzzleHttp\Exception\GuzzleException;


class Amo
{

    public static $access_token;
    public static $subdomain;
    private static $requestsTime = [];
    private static $requestsPerSecLimit = 7;
    public static $isPaymentExpired = false;

    public static function init(): bool
    {
        if (Amo::isInit()) return true;
        return self::auth();
    }

    public static function isInit(): bool
    {
        return !empty(self::$access_token);
    }

    public static function getCompanyGroups()
    {
        return self::request(self::apiUrl('companies/custom_fields/groups'));
    }

    public static function getCompanyCustomFields()
    {
        return self::request(self::apiUrl('companies/custom_fields'));
    }

    public static function getCatalogCustomFields($catalogId)
    {
        return self::request(self::apiUrl(sprintf('catalogs/%s/custom_fields', $catalogId)));
    }

    public static function getLeadGroups()
    {
        return self::request(self::apiUrl('leads/custom_fields/groups'));
    }

    public static function getContactGroups()
    {
        return self::request(self::apiUrl('contacts/custom_fields/groups'));
    }

    public static function getContactCustomFields()
    {
        return self::request(self::apiUrl('contacts/custom_fields'));
    }


    public static function auth($account_id = false): bool
    {
        if (!$account_id) {
            $client = self::getClient();
            if (!$client) {
                return false;
            }
            $account_id = $client->account_id;
        } else {
            $client = null;
        }

        $httpClient = new \GuzzleHttp\Client();

        $x_auth_token = JWT::encode([
            'account_id' => $account_id,
            'client_uuid' => config('amo.client_id')
        ], config('amo.client_secret'), 'HS256');

        try {
            $response = $httpClient->request(
                'GET',
                'https://integrations.salesup.pro/api/token',
                [
                    'verify' => false,
                    'headers' => [
                        'X-Auth-Token' => $x_auth_token
                    ],
                    'query' => [
                        'account_id' => $account_id,
                        'client_uuid' => config('amo.client_id')
                    ]
                ]
            );
        } catch (GuzzleException $exception) {
            $message = $exception->getMessage();

            if (strpos($message, 'Payment expired') !== false) {
                self::$isPaymentExpired = true;
            }
            return false;
        }

        if ($response->getStatusCode() !== 200) {
            return false;
        }

        $authParams = json_decode($response->getBody()->getContents(), true);
        if (isset($authParams['subdomain']) && isset($authParams['access_token'])) {
            self::$access_token = $authParams['access_token'];
            self::$subdomain = $authParams['subdomain'];

            if (!$client) {
                $client = Client::currentBySubdomain($authParams['subdomain']);
                if ($client) {
                    $client->account_id = $account_id;
                    $client->save();
                }
            }
        }

        return true;
    }

    public static function apiUrl($url, $params = []): string
    {
        $strParams = (count($params) > 0) ? sprintf('?%s', http_build_query($params)) : '';
        return sprintf('https://%s.amocrm.ru/api/v4/%s%s', self::$subdomain, $url, $strParams);
    }

    /** Засыпает на 1 секунду, если превышен лимит запросов в секунду */
    public static function sleepIfRequestLimit()
    {
        if (count(self::$requestsTime) > (self::$requestsPerSecLimit - 2)) {
            $delta = microtime(true) - self::$requestsTime[0];
            if ($delta <= 1) sleep(1);
            unset(self::$requestsTime[0]);
        }

        array_push(self::$requestsTime, microtime(true));
        self::$requestsTime = array_values(self::$requestsTime);
    }

    public static function getLeads($params)
    {
        if (!isset($params['limit'])) {
            $params['limit'] = 250;
        }

        $data = self::_getLeads($params);
        $result = [];
        if (isset($data->_embedded->leads)) {
            $result = $data->_embedded->leads;

            while (isset($data->_links->next->href)) {
                $data = self::_getLeads([], $data->_links->next->href);

                if (isset($data->_embedded->leads)) {
                    $result = array_merge($result, $data->_embedded->leads);

                } else {
                    $data = null;
                }
            }
        }

        return $result;
    }

    private static function _getLeads($params, $link = '')
    {
        if ($link) {
            $url = $link;
        } else {
            $url = self::apiUrl('leads', $params);
        }

        return self::request($url);
    }

    public static function getContacts($params)
    {
        $data = self::_getContacts($params);
        $result = [];
        if (isset($data->_embedded->contacts)) {
            $result = $data->_embedded->contacts;
            while (isset($data->_links->next->href)) {
                $data = self::_getContacts([], $data->_links->next->href);

                if (isset($data->_embedded->contacts)) {
                    $result = array_merge($result, $data->_embedded->contacts);

                } else {
                    $data = null;
                }
            }
        }

        return $result;
    }

    private static function _getContacts($params, $link = '')
    {
        if ($link) {
            $url = $link;
        } else {
            $url = self::apiUrl('contacts', $params);
        }

        return self::request($url);
    }

    public static function linkProductsToLead($leadId, $data)
    {
        return self::requestJson2(self::apiUrl(sprintf('leads/%s/link', $leadId)), $data);
    }

    public static function unlinkProductsToLead($leadId, $data)
    {
        return self::requestJson2(self::apiUrl(sprintf('leads/%s/unlink', $leadId)), $data);
    }

    public static function getLinksProductLead($leadId)
    {
        return self::request(self::apiUrl(sprintf('leads/%s/links', $leadId)));
    }

    private static function request($url, $associativeJsonDecode = false)
    {
        self::init();
        self::sleepIfRequestLimit();

        $ch = curl_init($url);

        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . self::$access_token
        ]);

        $json = curl_exec($ch);

        Log::amo('Запрос к апи-амо [GET]', [
            'url' => $url,
            'response' => json_decode($json, true)
        ], __METHOD__, __LINE__);

        curl_close($ch);
        return json_decode($json, $associativeJsonDecode);
    }

    private static function requestPost($url, $params)
    {
        self::init();
        self::sleepIfRequestLimit();

        $ch = curl_init($url);

        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, false);
        //curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . self::$access_token
        ]);

        $response = curl_exec($ch);

        \App\Models\Log::amo('Запрос к апи-амо [POST]', [
            'url' => $url,
            'params' => $params,
            'response' => json_decode($response, true)
        ], __METHOD__, __LINE__);

        curl_close($ch);
        return $response;
    }

    private static function requestJson($url, $params)
    {
        self::init();
        self::sleepIfRequestLimit();

        $ch = curl_init($url);

        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($params));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type:application/json',
            'Authorization: Bearer ' . self::$access_token
        ]);

        $response = curl_exec($ch);

        \App\Models\Log::amo('Запрос к апи-амо [PATH]', [
            'url' => $url,
            'params' => $params,
            'response' => json_decode($response, true)
        ], __METHOD__, __LINE__);

        curl_close($ch);
        return $response;
    }

    private static function requestJson2($url, $params)
    {
        self::init();
        self::sleepIfRequestLimit();

        $ch = curl_init($url);

        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, false);
        //curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($params));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type:application/json',
            'Authorization: Bearer ' . self::$access_token
        ]);

        $response = curl_exec($ch);

        \App\Models\Log::amo('Запрос к апи-амо [JSON]', [
            'url' => $url,
            'params' => $params,
            'response' => json_decode($response, true)
        ], __METHOD__, __LINE__);

        curl_close($ch);
        return $response;
    }

    private static function requestJsonDelete($url, $params)
    {
        self::init();
        self::sleepIfRequestLimit();

        $ch = curl_init($url);

        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($params));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type:application/json',
            'Authorization: Bearer ' . self::$access_token
        ]);

        $response = curl_exec($ch);

        \App\Models\Log::amo('Запрос к апи-амо [DELETE]', [
            'url' => $url,
            'params' => $params,
            'response' => json_decode($response, true)
        ], __METHOD__, __LINE__);

        curl_close($ch);
        return $response;
    }

    public static function getLead($leadId, $params = [], $associativeJsonDecode = false)
    {
        if (!isset(self::$leads[$leadId][$associativeJsonDecode]) || !self::$leads[$leadId][$associativeJsonDecode]) {
            self::$leads[$leadId][$associativeJsonDecode] = self::request(self::apiUrl(sprintf('leads/%s', $leadId), $params), $associativeJsonDecode);
        }
        return self::$leads[$leadId][$associativeJsonDecode];
    }

    public static function getContact($contactId, $params = [])
    {
        return self::request(self::apiUrl(sprintf('contacts/%s', $contactId), $params));
    }

    public static function getCompany($companyId, $params = [])
    {
        return self::request(self::apiUrl(sprintf('companies/%s', $companyId), $params));
    }

    public static function getUsers(): array
    {
        $result = [];
        $url = self::apiUrl('users');
        do {
            $response = self::request($url, true);
            if (isset($response['_embedded']['users'])) $result = array_merge($result, $response['_embedded']['users']);
            $url = (isset($response['_links']['next']['href'])) ? $response['_links']['next']['href'] : '';
        } while ($url);

        return $result;
    }

    public static function getLeadCustomFields($associativeJsonDecode = true): array
    {
        $result = [];
        $url = self::apiUrl('leads/custom_fields');

        do {
            $response = self::request($url, true);
            if (isset($response['_embedded']['custom_fields'])) $result = array_merge($result, $response['_embedded']['custom_fields']);
            $url = (isset($response['_links']['next']['href'])) ? $response['_links']['next']['href'] : '';
        } while ($url);

        if (!$associativeJsonDecode) {
            $result = json_decode(json_encode($result), false);
        }

        return $result;
    }

    public static function getLeadGroupsCustomFields(): array
    {
        $result = [];
        $url = self::apiUrl('leads/custom_fields/groups');
        do {
            $response = self::request($url, true);
            if (isset($response['_embedded']['custom_field_groups'])) $result = array_merge($result, $response['_embedded']['custom_field_groups']);
            $url = (isset($response['_links']['next']['href'])) ? $response['_links']['next']['href'] : '';
        } while ($url);

        return $result;
    }

    public static function getLeadPipelines(): array
    {
        $response = self::request(self::apiUrl('leads/pipelines'), true);

        if (isset($response['_embedded']['pipelines'])) {
            $pipelines = $response['_embedded']['pipelines'];
            foreach ($pipelines as $p => $pipeline) {
                if (isset($pipeline['_embedded']['statuses'])) {
                    $statuses = $pipeline['_embedded']['statuses'];

                    foreach ($statuses as $s => $status) {
                        if (isset($status['_links'])) unset($statuses[$s]['_links']);
                    }
                    $pipelines[$p]['statuses'] = $statuses;
                    unset($pipelines[$p]['_embedded']);
                }
                if (isset($pipeline['_links'])) {
                    unset($pipelines[$p]['_links']);
                }
            }

            return $pipelines;
        } else return [];
    }

    public static function getLeadGroupsWithCustomFields(): array
    {
        $customFields = self::getLeadCustomFields();
        $groups = self::getLeadGroupsCustomFields();

        foreach ($customFields as $f => $customField) {
            if (!$customField['group_id']) $customField['group_id'] = 'default';

            foreach ($groups as $g => $group) {
                if ($customField['group_id'] == $group['id']) {
                    if (!isset($group['custom_fields'])) $groups[$g]['custom_fields'] = [];
                    $groups[$g]['custom_fields'][] = $customField;
                    unset($customFields[$f]);
                }
            }
        }

        return $groups;
    }


    public static function findContacts(string $query)
    {
        $data = self::_findContacts($query);
        $result = [];
        if (isset($data->_embedded->contacts)) {
            $result = $data->_embedded->contacts;
            while (isset($data->_links->next->href)) {
                $data = self::_findContacts([], $data->_links->next->href);

                if (isset($data->_embedded->contacts)) {
                    $result = array_merge($result, $data->_embedded->contacts);

                } else {
                    $data = null;
                }
            }
        }

        return $result;
    }

    private static function _findContacts($query, $link = '')
    {
        if ($link) {
            $url = $link;
        } else {
            $url = self::apiUrl(sprintf('contacts?query=%s', $query));
        }

        return self::request($url);
    }

    public static function leadUpdate($leadId, $params)
    {
        return self::requestJson(self::apiUrl(sprintf('leads/%s', $leadId)), $params);
    }

    public static function leadAdd($params)
    {
        return self::requestPost(self::apiUrl('leads'), $params);
    }

    public static function getAccount($params)
    {
        return self::request(self::apiUrl('account'), $params);
    }

    public static function getWidget($code)
    {
        return self::request(self::apiUrl(sprintf('widgets/%s', $code)), true);
    }

    public static function getWidgets()
    {
        return self::request(self::apiUrl('widgets'), true);
    }

    public static function getCurrentWidgetVersion()
    {
        $response = Amo::getWidget('sls_warehouse');
        return $response['version'] ?? 0;
    }

    public static function addHook($params)
    {
        return self::requestJson2(self::apiUrl('webhooks'), $params);
    }

    public static function deleteHook($params)
    {
        return self::requestJsonDelete(self::apiUrl('webhooks'), $params);
    }

    public static function getUser($userId)
    {
        return self::request(self::apiUrl(sprintf('users/%s', $userId)));
    }

    public static function addTask($params)
    {
        return self::requestJson2(self::apiUrl('tasks'), $params);
    }

    public static function getTasks($params)
    {
        return self::request(self::apiUrl('tasks', $params));
    }

    public static function getAmoProductList()
    {
        $result = Amo::request(Amo::apiUrl('catalogs'));
        $list = [];
        if (isset($result->_embedded->catalogs)) {
            foreach ($result->_embedded->catalogs as $catalog) {
                if (isset($catalog->type) && $catalog->type == 'products') {
                    $list[] = [
                        'id' => $catalog->id,
                        'name' => $catalog->name
                    ];
                }
            }
        }

        return $list;
    }


    public static function getLeadGroupsArray(): array
    {
        $groups = Amo::getLeadGroups();
        $result = [];
        if (isset($groups->_embedded->custom_field_groups) && is_array($groups->_embedded->custom_field_groups)) {
            foreach ($groups->_embedded->custom_field_groups as $group) {
                $result[$group->id] = $group->name;
            }
        }

        return $result;
    }

    public static function getWebHooks($associativeJsonDecode = false)
    {
        return self::request(self::apiUrl('webhooks'), $associativeJsonDecode);
    }
}
