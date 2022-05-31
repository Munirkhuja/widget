define([
    'jquery',
    'https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js'
], function ($) {
    return function () {
        let self = this;
        self.apiUrl = 'https://munir.salesup.pro/api/';
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

            $.ajax({
                url: self.apiUrl + 'get-pipeline-column/' + AMOCRM.constant('account').id + '/' + $('.list-top-nav__text-button span').eq(0).text(),
                method: 'get'
            }).done(function (result) {
                if (result) {
                    self.columnHide = jQuery.parseJSON(result.columns_id);
                    self.columnHide.forEach(function (item) {
                        $('div[data-field-code="' + item + '"]').hide();
                    });
                }
            });
        };
        this.callbacks = {
            render: function () {
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
                        }, "json");
                }

                return true;
            },
            bind_actions: function () {
                $("#save_pipeline").click(function () {
                    titleColumn = $('.cell-head__title');
                    columns_id = [];
                    for (i = 0; i < titleColumn.length; i++) {
                        columns_id.push(titleColumn.eq(i).closest('.list-row__cell').attr("data-field-code"));
                    }
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
            }
        };
        return this;
    };
});
