define(['jquery'], function ($) {
    return function () {
        let self = this;
        self.apiUrl = 'https://munir.salesup.pro/api/';
        self.settings = self.get_settings();
        self.pipelineOption = [];
        self.columnHide = [];
        self.renderSelect = function () {
            var twig = require('twigjs');
            var inputPipeline = twig({
                ref: '/tmpl/controls/select.twig'
            }).render({
                id: 'pipeline_select',
                items: self.pipelineOption,
            });
            var buttonPipeline = twig({
                ref: '/tmpl/controls/button.twig'
            }).render({
                id: 'save_pipeline',
                text: 'Сохранить настройки',
                class_name: "button-input_blue",
            });
            $('.column_settings').append('<div class="column_settings__done_wrapper" id="forRemoveSelect">' +
                '<div style="float: left">' + buttonPipeline +
                '</div><div style="float: left;margin-left: 5px">' + inputPipeline + '</div></div>');
        };
        self.getDataHideColumn = function () {

            console.log('get start');
            $.ajax({
                url: self.apiUrl + 'get-pipeline-column/' + AMOCRM.constant('account').id + '/' + $('.list-top-nav__text-button span').eq(0).text(),
                method: 'get'
            }).done(function (result) {
                if (result) {
                    self.columnHide = jQuery.parseJSON(result.columns_id);
                    self.columnHide.forEach(function (item) {
                        $('div[data-field-code="' + item + '"]').hide();
                    });

                    console.log('get work',result);
                }
            });
        };
        this.callbacks = {
            onSave: function (data) {
                return true;
            },
            render: function () {
                console.log('render start');
                if ($('.list-row__cell').length) $('.list-row__cell').show();
                if ($('#forRemoveSelect').length) $('#forRemoveSelect').remove();
                self.getDataHideColumn();
                if (AMOCRM.data.current_entity === 'contacts') {
                    self.pipelineOption = [
                        {id: 'Контакты', option: 'Контакты'},
                        {id: 'Компании', option: 'Компании'},
                        {id: 'Все контакты и компании', option: 'Все контакты и компании'},
                    ];
                    self.renderSelect();
                    console.log('render 1 work');
                }
                if (AMOCRM.data.current_entity === 'leads') {
                    $('div[data-field-code="name"]').hide();
                    $.get('/api/v4/leads/pipelines',
                        function (result) {
                            pipl = result['_embedded'].pipelines;
                            self.pipelineOption = pipl.map(function (item) {
                                return {id: item['name'], option: item['name']};
                            });
                            self.renderSelect();
                            console.log('render 2 work');
                        }, "json");
                }

                return true;
            },
            bind_actions: function () {
                $("#save_pipeline").click(function () {
                    console.log('save onclick');
                    titleColumn = $('.cell-head__title');
                    columns_id = [];
                    for (i = 0; i < titleColumn.length; i++) {
                        columns_id.push(titleColumn.eq(i).closest('.list-row__cell').attr("data-field-code"));
                    }
                    console.log('save ',columns_id);
                    $.ajax({
                        url: self.apiUrl + 'set-pipeline-column',
                        method: 'post',
                        data: {
                            account_id: AMOCRM.constant('account').id,
                            pipeline_id: $('#pipeline_select').val(),
                            columns_id: columns_id,
                        },
                    })
                });
                return true;
            },


            init: function () {
                return true;
            },
            advancedSettings: function () {
                return true;
            },

            loadPreloadedData: function () {
                return true;
            },
            settings: function () {
                return true;
            },
            destroy: function () {
                return true;
            },


            contacts: {
                selected: function () {
                    return true;
                }

            },
            leads: {
                selected: function () {
                }
            },
            tasks: {
                selected: function () {
                }
            }
        };
        return this;
    };
});
