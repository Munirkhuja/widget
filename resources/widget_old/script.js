define([
    'jquery',
    'https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js'
], function ($) {
    return function () {
        let self = this;
        self.apiUrl = '...';
        self.settings = self.get_settings();
        self.token = ''; // использовать при необходимости

        // свои методы сюда, пример запроса к бэку:
        self.functionExample = function () {
            self.$authorizedAjax({
                url: self.apiUrl + 'путь к экшну',
                method: 'get',
                data: {
                    account_id: AMOCRM.constant('account').id, // обязательный параметр
                    client_uuid: self.settings.oauth_client_uuid,  // обязательный параметр
                    user: AMOCRM.constant('user').id  // ид текущего пользователя, при необходимости
                    //... еще параметры, при необходимости
                }
            }).done(function(result) {
                // обрабатываем ответ
            });
        }

        // пример метода использующий токен для iframe
        self.functionIFrameExample = function () {
            let widgetWorkArea = $('#work-area-' + self.settings.widget_code);
            if (widgetWorkArea.length) {
                widgetWorkArea.attr('style', "width: 100%; height: 1400px;");
                widgetWorkArea.html('<iframe style="width: 100%; height: 100%" src="https://i-frame-url?token='+self.token+'" ' +
                    '>\n' +
                    '    Ваш браузер не поддерживает плавающие фреймы!\n' +
                    ' </iframe>' );
            }
        }

        // при необходимости, можно использовать токен клиента, например для его идентификации во фрейме
        self.getToken = function(callback) {
            self.$authorizedAjax({
                url: self.apiUrl + 'get-token',
                method: 'GET',
                data: {
                    account_id: AMOCRM.constant('account').id,
                    client_uuid: self.settings.oauth_client_uuid,
                    user_id: AMOCRM.constant('user').id
                }
            }).done(function(result) {
                if (result.token) {
                    self.token = result.token
                    callback();
                }
            });
        }

        this.callbacks = {
            settings: function ($widgetSettings) {
                // для валидации телефона
                $widgetSettings.find('input[name="phone"]').on('keypress', function (event) {
                    if ($(this).val().length === 16) {
                        return false;
                    }

                    let input = String.fromCharCode(event.which);
                    let position = event.target.selectionStart;

                    if (!(position === 0 && input === '+' || !isNaN(input))) {
                        return false;
                    }
                });

                return true;
            },
            onSave: function (data) {
                // обязательное сохранение телефона и других обязательных свойств в ядре тут:
                if (self.settings.phone !== data.fields.phone) {
                    self.$authorizedAjax({
                        url: 'https://integrations.salesup.pro/api/configure',
                        method: 'GET',
                        data: {
                            account_id: AMOCRM.constant('account').id,
                            client_uuid: self.settings.oauth_client_uuid,
                            current_user_id: AMOCRM.constant('user').id,
                            phone: data.fields.phone
                        }
                    });
                }

                return true;
            },

            render: function () {
                if ($('link[href="' + self.settings.path + '/style.css?v=' + self.settings.version + '"').length < 1) {
                    $('head').append('<link href="' + self.settings.path + '/style.css?v=' + self.settings.version + '" type="text/css" rel="stylesheet">');
                }

                // пример условия для включения логики виджета в карточке сделки
                if (AMOCRM.isCard() && AMOCRM.getBaseEntity() === "leads") {
                    // при необходимости
                    self.getToken(function() {
                        //Что-то делаем после получения токена, например
                        self.functionIFrameExample();
                    });
                    self.functionExample();
                }

                return true;
            },

            init: function () {
                return true;
            },
            bind_actions: function () {
                return true;
            }
        };
        return this;
    };
});
