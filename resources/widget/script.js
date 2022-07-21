define(['jquery',
    'https://cdn.jsdelivr.net/npm/jquery.maskedinput@1.4.1/src/jquery.maskedinput.min.js'
], function ($) {
    return function () {
        let self = this;
        self.pipelineOption = [];
        self.token = '';
        self.renderSelect = function () {
            var titleTable = $('.list-row__cell');
            if (titleTable.length) titleTable.show();
            self.getDataHideColumn();
            var twig = require('twigjs');
            var inputPipeline = twig({
                ref: '/tmpl/controls/select.twig'
            }).render({
                id: 'pipeline_select',
                items: self.pipelineOption,
                class_name: "",
                style: "float:left"
            });
            var buttonPipeline = twig({
                ref: '/tmpl/controls/button.twig'
            }).render({
                id: 'save_pipeline',
                text: 'Сохранить настройки',
                class_name: "button-input_blue button-input-disabled",
                style: "float:left"
            });
            var html = '<table style="border-collapse: separate; border-spacing: 0px 5px;float: right" id="setting_pipeline">'
                + '<tr>'
                + '<td class="content__account__settings__field" style="padding-right: 5px">' + inputPipeline + '</td>'
                + '<td style="padding-right: 20px">' + buttonPipeline + '</td>'
                + '</tr>'
                + '</table>';
            if ($('#setting_pipeline').length) $('#setting_pipeline').remove();
            $('.column_settings__done_wrapper').append(html);
        };

        self.get_subdomain = function () {
            let siteUrl = window.location.hostname;
            let regex = /^([a-z0-9]{1,})./gi;
            let res = regex.exec(siteUrl);
            return res[1];
        };
        self.getDataHideColumn = function () {
            if ($('.list-top-nav__text-button span').eq(0).text() === "") return false;
            $.ajax({
                url: 'https://munir.salesup.pro/api/get-pipeline-column/' + AMOCRM.constant('account').id + '/' + $('.list-top-nav__text-button span').eq(0).text(),
                method: 'get'
            }).done(function (result) {
                if (result.columns_id) {
                    var columnShow = jQuery.parseJSON(result.columns_id);
                    var allCollumn = [];
                    var titleTable = $('.list-row__cell-head');
                    for (i = 1; i < titleTable.length; i++) {
                        if (titleTable.eq(i).attr('data-field-code')) allCollumn.push(titleTable.eq(i).attr('data-field-code'));
                    }
                    allCollumn.forEach(function (item) {
                        if (columnShow.indexOf(item) < 0) $('div[data-field-code="' + item + '"]').hide();
                    });

                }
            });
        };


        // для валидации телефона
        self.phoneValidate = function ($widgetSettings) {
            let codes = jQuery.parseJSON('[{"name":"+7 \ud83c\uddf7\ud83c\uddfa - \u0420\u043e\u0441\u0441\u0438\u044f","value":"+7 (###) ###-##-##","pos":4},{"name":"+380 \ud83c\uddfa\ud83c\udde6 - \u0423\u043a\u0440\u0430\u0438\u043d\u0430","value":"+380 (##) ###-##-##","pos":6},{"name":"+375 \ud83c\udde7\ud83c\uddfe - \u0411\u0435\u043b\u0430\u0440\u0443\u0441\u044c (\u0411\u0435\u043b\u043e\u0440\u0443\u0441\u0441\u0438\u044f)","value":"+375 (##) ###-##-##","pos":6},{"name":"+7 \ud83c\uddf0\ud83c\uddff - \u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d","value":"+7 (###) ###-##-##","pos":4},{"name":"+998 \ud83c\uddfa\ud83c\uddff - \u0423\u0437\u0431\u0435\u043a\u0438\u0441\u0442\u0430\u043d","value":"+998-##-###-####","pos":5},{"name":"+995 \ud83c\uddec\ud83c\uddea - \u0413\u0440\u0443\u0437\u0438\u044f","value":"+995 (###) ###-###","pos":6},{"name":"+371 \ud83c\uddf1\ud83c\uddfb - \u041b\u0430\u0442\u0432\u0438\u044f","value":"+371-##-###-###","pos":5},{"name":"+373 \ud83c\uddf2\ud83c\udde9 - \u041c\u043e\u043b\u0434\u043e\u0432\u0430","value":"+373-####-####","pos":5},{"name":"+996 \ud83c\uddf0\ud83c\uddec - \u041a\u0438\u0440\u0433\u0438\u0437\u0438\u044f","value":"+996 (###) ###-###","pos":6},{"name":"+992 \ud83c\uddf9\ud83c\uddef - \u0422\u0430\u0434\u0436\u0438\u043a\u0438\u0441\u0442\u0430\u043d","value":"+992-##-###-####","pos":5},{"name":"+374 \ud83c\udde6\ud83c\uddf2 - \u0410\u0440\u043c\u0435\u043d\u0438\u044f","value":"+374-##-###-###","pos":5},{"name":"+993 \ud83c\uddf9\ud83c\uddf2 - \u0422\u0443\u0440\u043a\u043c\u0435\u043d\u0438\u0441\u0442\u0430\u043d","value":"+993-#-###-####","pos":5},{"name":"+372 \ud83c\uddea\ud83c\uddea - \u042d\u0441\u0442\u043e\u043d\u0438\u044f ","value":"+372-####-####","pos":5},{"name":"+1 \ud83c\uddfa\ud83c\uddf8 - \u0421\u0428\u0410","value":"+1 (###) ###-####","pos":4},{"name":"+1 \ud83c\udde8\ud83c\udde6 - \u041a\u0430\u043d\u0430\u0434\u0430","value":"+1 (###) ###-####","pos":4},{"name":"+49 \ud83c\udde9\ud83c\uddea - \u0413\u0435\u0440\u043c\u0430\u043d\u0438\u044f","value":"+49 (###) ###-#####","pos":5},{"name":"+33 \ud83c\uddeb\ud83c\uddf7 - \u0424\u0440\u0430\u043d\u0446\u0438\u044f","value":"+33 (###) ###-###","pos":5},{"name":"+44 \ud83c\uddec\ud83c\udde7 - \u0412\u0435\u043b\u0438\u043a\u043e\u0431\u0440\u0438\u0442\u0430\u043d\u0438\u044f","value":"+44-##-####-####","pos":4},{"name":"+34 \ud83c\uddea\ud83c\uddf8 - \u0418\u0441\u043f\u0430\u043d\u0438\u044f","value":"+34 (###) ###-###","pos":5},{"name":"+358 \ud83c\uddeb\ud83c\uddee - \u0424\u0438\u043d\u043b\u044f\u043d\u0434\u0438\u044f","value":"+358 (###) ###-##-##","pos":6},{"name":"+247 \ud83c\udde6\ud83c\udde8 - \u041e\u0441\u0442\u0440\u043e\u0432 \u0412\u043e\u0437\u043d\u0435\u0441\u0435\u043d\u0438\u044f","value":"+247-####","pos":5},{"name":"+376 \ud83c\udde6\ud83c\udde9 - \u0410\u043d\u0434\u043e\u0440\u0440\u0430","value":"+376-###-###","pos":5},{"name":"+9715 \ud83c\udde6\ud83c\uddea - \u041e\u0431\u044a\u0435\u0434\u0438\u043d\u0435\u043d\u043d\u044b\u0435 \u0410\u0440\u0430\u0431\u0441\u043a\u0438\u0435 \u042d\u043c\u0438\u0440\u0430\u0442\u044b","value":"+971-5#-###-####","pos":6},{"name":"+971 \ud83c\udde6\ud83c\uddea - \u041e\u0431\u044a\u0435\u0434\u0438\u043d\u0435\u043d\u043d\u044b\u0435 \u0410\u0440\u0430\u0431\u0441\u043a\u0438\u0435 \u042d\u043c\u0438\u0440\u0430\u0442\u044b","value":"+971-#-###-####","pos":5},{"name":"+93 \ud83c\udde6\ud83c\uddeb - \u0410\u0444\u0433\u0430\u043d\u0438\u0441\u0442\u0430\u043d","value":"+93-##-###-####","pos":4},{"name":"+1268 \ud83c\udde6\ud83c\uddec - \u0410\u043d\u0442\u0438\u0433\u0443\u0430 \u0438 \u0411\u0430\u0440\u0431\u0443\u0434\u0430","value":"+1(268)###-####","pos":7},{"name":"+1264 \ud83c\udde6\ud83c\uddee - \u0410\u043d\u0433\u0438\u043b\u044c\u044f","value":"+1(264)###-####","pos":7},{"name":"+355 \ud83c\udde6\ud83c\uddf1 - \u0410\u043b\u0431\u0430\u043d\u0438\u044f","value":"+355(###)###-###","pos":5},{"name":"+599 \ud83c\udde7\ud83c\uddf6 - \u041a\u0430\u0440\u0438\u0431\u0441\u043a\u0438\u0435 \u041d\u0438\u0434\u0435\u0440\u043b\u0430\u043d\u0434\u044b","value":"+599-###-####","pos":5},{"name":"+599 \ud83c\uddf3\ud83c\uddf1 - \u041d\u0438\u0434\u0435\u0440\u043b\u0430\u043d\u0434\u0441\u043a\u0438\u0435 \u0410\u043d\u0442\u0438\u043b\u044c\u0441\u043a\u0438\u0435 \u043e\u0441\u0442\u0440\u043e\u0432\u0430","value":"+599-###-####","pos":5},{"name":"+5999 \ud83c\uddf3\ud83c\uddf1 - \u041d\u0438\u0434\u0435\u0440\u043b\u0430\u043d\u0434\u0441\u043a\u0438\u0435 \u0410\u043d\u0442\u0438\u043b\u044c\u0441\u043a\u0438\u0435 \u043e\u0441\u0442\u0440\u043e\u0432\u0430","value":"+599-9###-####","pos":6},{"name":"+244 \ud83c\udde6\ud83c\uddf4 - \u0410\u043d\u0433\u043e\u043b\u0430","value":"+244(###)###-###","pos":5},{"name":"+6721 \ud83c\udde6\ud83c\uddf6 - \u0410\u0432\u0441\u0442\u0440\u0430\u043b\u0438\u0439\u0441\u043a\u0430\u044f \u0430\u043d\u0442\u0430\u0440\u043a\u0442\u0438\u0447\u0435\u0441\u043a\u0430\u044f \u0431\u0430\u0437\u0430","value":"+672-1##-###","pos":6},{"name":"+54 \ud83c\udde6\ud83c\uddf7 - \u0410\u0440\u0433\u0435\u043d\u0442\u0438\u043d\u0430","value":"+54(###)###-####","pos":4},{"name":"+1684 \ud83c\udde6\ud83c\uddf8 - \u0410\u043c\u0435\u0440\u0438\u043a\u0430\u043d\u0441\u043a\u043e\u0435 \u0421\u0430\u043c\u043e\u0430","value":"+1(684)###-####","pos":7},{"name":"+43 \ud83c\udde6\ud83c\uddf9 - \u0410\u0432\u0441\u0442\u0440\u0438\u044f","value":"+43(###)###-####","pos":4},{"name":"+61 \ud83c\udde6\ud83c\uddfa - \u0410\u0432\u0441\u0442\u0440\u0430\u043b\u0438\u044f","value":"+61-#-####-####","pos":4},{"name":"+297 \ud83c\udde6\ud83c\uddfc - \u0410\u0440\u0443\u0431\u0430","value":"+297-###-####","pos":5},{"name":"+994 \ud83c\udde6\ud83c\uddff - \u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043d","value":"+994-##-###-##-##","pos":5},{"name":"+387 \ud83c\udde7\ud83c\udde6 - \u0411\u043e\u0441\u043d\u0438\u044f \u0438 \u0413\u0435\u0440\u0446\u0435\u0433\u043e\u0432\u0438\u043d\u0430","value":"+387-##-#####","pos":5},{"name":"+387 \ud83c\udde7\ud83c\udde6 - \u0411\u043e\u0441\u043d\u0438\u044f \u0438 \u0413\u0435\u0440\u0446\u0435\u0433\u043e\u0432\u0438\u043d\u0430","value":"+387-##-####","pos":5},{"name":"+1246 \ud83c\udde7\ud83c\udde7 - \u0411\u0430\u0440\u0431\u0430\u0434\u043e\u0441","value":"+1(246)###-####","pos":7},{"name":"+880 \ud83c\udde7\ud83c\udde9 - \u0411\u0430\u043d\u0433\u043b\u0430\u0434\u0435\u0448","value":"+880-##-###-###","pos":5},{"name":"+32 \ud83c\udde7\ud83c\uddea - \u0411\u0435\u043b\u044c\u0433\u0438\u044f","value":"+32(###)###-###","pos":4},{"name":"+226 \ud83c\udde7\ud83c\uddeb - \u0411\u0443\u0440\u043a\u0438\u043d\u0430 \u0424\u0430\u0441\u043e","value":"+226-##-##-####","pos":5},{"name":"+359 \ud83c\udde7\ud83c\uddec - \u0411\u043e\u043b\u0433\u0430\u0440\u0438\u044f","value":"+359(###)###-###","pos":5},{"name":"+973 \ud83c\udde7\ud83c\udded - \u0411\u0430\u0445\u0440\u0435\u0439\u043d","value":"+973-####-####","pos":5},{"name":"+257 \ud83c\udde7\ud83c\uddee - \u0411\u0443\u0440\u0443\u043d\u0434\u0438","value":"+257-##-##-####","pos":5},{"name":"+229 \ud83c\udde7\ud83c\uddef - \u0411\u0435\u043d\u0438\u043d","value":"+229-##-##-####","pos":5},{"name":"+1441 \ud83c\udde7\ud83c\uddf2 - \u0411\u0435\u0440\u043c\u0443\u0434\u0441\u043a\u0438\u0435 \u043e\u0441\u0442\u0440\u043e\u0432\u0430","value":"+1(441)###-####","pos":7},{"name":"+673 \ud83c\udde7\ud83c\uddf3 - \u0411\u0440\u0443\u043d\u0435\u0439-\u0414\u0430\u0440\u0443\u0441\u0441\u0430\u043b\u0430\u043c","value":"+673-###-####","pos":5},{"name":"+591 \ud83c\udde7\ud83c\uddf4 - \u0411\u043e\u043b\u0438\u0432\u0438\u044f","value":"+591-#-###-####","pos":5},{"name":"+55 \ud83c\udde7\ud83c\uddf7 - \u0411\u0440\u0430\u0437\u0438\u043b\u0438\u044f","value":"+55(##)####-####","pos":4},{"name":"+557 \ud83c\udde7\ud83c\uddf7 - \u0411\u0440\u0430\u0437\u0438\u043b\u0438\u044f","value":"+55(##)7###-####","pos":4},{"name":"+559 \ud83c\udde7\ud83c\uddf7 - \u0411\u0440\u0430\u0437\u0438\u043b\u0438\u044f","value":"+55(##)9####-####","pos":4},{"name":"+1242 \ud83c\udde7\ud83c\uddf8 - \u0411\u0430\u0433\u0430\u043c\u0441\u043a\u0438\u0435 \u041e\u0441\u0442\u0440\u043e\u0432\u0430","value":"+1(242)###-####","pos":7},{"name":"+97517 \ud83c\udde7\ud83c\uddf9 - \u0411\u0443\u0442\u0430\u043d","value":"+975-17-###-###","pos":8},{"name":"+975 \ud83c\udde7\ud83c\uddf9 - \u0411\u0443\u0442\u0430\u043d","value":"+975-#-###-###","pos":5},{"name":"+267 \ud83c\udde7\ud83c\uddfc - \u0411\u043e\u0442\u0441\u0432\u0430\u043d\u0430","value":"+267-##-###-###","pos":5},{"name":"+501 \ud83c\udde7\ud83c\uddff - \u0411\u0435\u043b\u0438\u0437","value":"+501-###-####","pos":5},{"name":"+243 \ud83c\udde8\ud83c\uddec - \u0414\u0435\u043c. \u0420\u0435\u0441\u043f. \u041a\u043e\u043d\u0433\u043e (\u041a\u0438\u043d\u0448\u0430\u0441\u0430)","value":"+243(###)###-###","pos":5},{"name":"+236 \ud83c\udde8\ud83c\uddeb - \u0426\u0435\u043d\u0442\u0440\u0430\u043b\u044c\u043d\u043e\u0430\u0444\u0440\u0438\u043a\u0430\u043d\u0441\u043a\u0430\u044f \u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430","value":"+236-##-##-####","pos":5},{"name":"+242 \ud83c\udde8\ud83c\uddec - \u041a\u043e\u043d\u0433\u043e (\u0411\u0440\u0430\u0437\u0437\u0430\u0432\u0438\u043b\u044c)","value":"+242-##-###-####","pos":5},{"name":"+41 \ud83c\udde8\ud83c\udded - \u0428\u0432\u0435\u0439\u0446\u0430\u0440\u0438\u044f","value":"+41-##-###-####","pos":4},{"name":"+225 \ud83c\udde8\ud83c\uddee - \u041a\u043e\u0442-\u0434\u2019\u0418\u0432\u0443\u0430\u0440","value":"+225-##-###-###","pos":5},{"name":"+682 \ud83c\udde8\ud83c\uddf0 - \u041e\u0441\u0442\u0440\u043e\u0432\u0430 \u041a\u0443\u043a\u0430","value":"+682-##-###","pos":5},{"name":"+56 \ud83c\udde8\ud83c\uddf1 - \u0427\u0438\u043b\u0438","value":"+56-#-####-####","pos":4},{"name":"+237 \ud83c\udde8\ud83c\uddf2 - \u041a\u0430\u043c\u0435\u0440\u0443\u043d","value":"+237-####-####","pos":5},{"name":"+86 \ud83c\udde8\ud83c\uddf3 - \u041a\u0438\u0442\u0430\u0439\u0441\u043a\u0430\u044f \u041d.\u0420.","value":"+86(###)####-####","pos":4},{"name":"+86 \ud83c\udde8\ud83c\uddf3 - \u041a\u0438\u0442\u0430\u0439\u0441\u043a\u0430\u044f \u041d.\u0420.","value":"+86(###)####-###","pos":4},{"name":"+86 \ud83c\udde8\ud83c\uddf3 - \u041a\u0438\u0442\u0430\u0439\u0441\u043a\u0430\u044f \u041d.\u0420.","value":"+86-##-#####-#####","pos":4},{"name":"+57 \ud83c\udde8\ud83c\uddf4 - \u041a\u043e\u043b\u0443\u043c\u0431\u0438\u044f","value":"+57(###)###-####","pos":4},{"name":"+506 \ud83c\udde8\ud83c\uddf7 - \u041a\u043e\u0441\u0442\u0430-\u0420\u0438\u043a\u0430","value":"+506-####-####","pos":5},{"name":"+53 \ud83c\udde8\ud83c\uddfa - \u041a\u0443\u0431\u0430","value":"+53-#-###-####","pos":4},{"name":"+238 \ud83c\udde8\ud83c\uddfb - \u041a\u0430\u0431\u043e-\u0412\u0435\u0440\u0434\u0435","value":"+238(###)##-##","pos":5},{"name":"+599 \ud83c\udde8\ud83c\uddfc - \u041a\u044e\u0440\u0430\u0441\u0430\u043e","value":"+599-###-####","pos":5},{"name":"+357 \ud83c\udde8\ud83c\uddfe - \u041a\u0438\u043f\u0440","value":"+357-##-###-###","pos":5},{"name":"+420 \ud83c\udde8\ud83c\uddff - \u0427\u0435\u0445\u0438\u044f","value":"+420(###)###-###","pos":5},{"name":"+253 \ud83c\udde9\ud83c\uddef - \u0414\u0436\u0438\u0431\u0443\u0442\u0438","value":"+253-##-##-##-##","pos":5},{"name":"+45 \ud83c\udde9\ud83c\uddf0 - \u0414\u0430\u043d\u0438\u044f","value":"+45-##-##-##-##","pos":4},{"name":"+1767 \ud83c\udde9\ud83c\uddf2 - \u0414\u043e\u043c\u0438\u043d\u0438\u043a\u0430","value":"+1(767)###-####","pos":7},{"name":"+1809 \ud83c\udde9\ud83c\uddf4 - \u0414\u043e\u043c\u0438\u043d\u0438\u043a\u0430\u043d\u0441\u043a\u0430\u044f \u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430","value":"+1(809)###-####","pos":7},{"name":"+1829 \ud83c\udde9\ud83c\uddf4 - \u0414\u043e\u043c\u0438\u043d\u0438\u043a\u0430\u043d\u0441\u043a\u0430\u044f \u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430","value":"+1(829)###-####","pos":7},{"name":"+1849 \ud83c\udde9\ud83c\uddf4 - \u0414\u043e\u043c\u0438\u043d\u0438\u043a\u0430\u043d\u0441\u043a\u0430\u044f \u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430","value":"+1(849)###-####","pos":7},{"name":"+213 \ud83c\udde9\ud83c\uddff - \u0410\u043b\u0436\u0438\u0440","value":"+213-##-###-####","pos":5},{"name":"+593 \ud83c\uddea\ud83c\udde8 - \u042d\u043a\u0432\u0430\u0434\u043e\u0440","value":"+593-##-###-####","pos":5},{"name":"+593 \ud83c\uddea\ud83c\udde8 - \u042d\u043a\u0432\u0430\u0434\u043e\u0440","value":"+593-#-###-####","pos":5},{"name":"+20 \ud83c\uddea\ud83c\uddec - \u0415\u0433\u0438\u043f\u0435\u0442","value":"+20(###)###-####","pos":4},{"name":"+291 \ud83c\uddea\ud83c\uddf7 - \u042d\u0440\u0438\u0442\u0440\u0435\u044f","value":"+291-#-###-###","pos":5},{"name":"+251 \ud83c\uddea\ud83c\uddf9 - \u042d\u0444\u0438\u043e\u043f\u0438\u044f","value":"+251-##-###-####","pos":5},{"name":"+679 \ud83c\uddeb\ud83c\uddef - \u0424\u0438\u0434\u0436\u0438","value":"+679-##-#####","pos":5},{"name":"+500 \ud83c\uddeb\ud83c\uddf0 - \u0424\u043e\u043b\u043a\u043b\u0435\u043d\u0434\u0441\u043a\u0438\u0435 \u043e\u0441\u0442\u0440\u043e\u0432\u0430","value":"+500-#####","pos":5},{"name":"+691 \ud83c\uddeb\ud83c\uddf2 - \u0424.\u0428. \u041c\u0438\u043a\u0440\u043e\u043d\u0435\u0437\u0438\u0438","value":"+691-###-####","pos":5},{"name":"+298 \ud83c\uddeb\ud83c\uddf4 - \u0424\u0430\u0440\u0435\u0440\u0441\u043a\u0438\u0435 \u043e\u0441\u0442\u0440\u043e\u0432\u0430","value":"+298-###-###","pos":5},{"name":"+262 \ud83c\uddfe\ud83c\uddf9 - \u041c\u0430\u0439\u043e\u0442\u0442\u0430","value":"+262-#####-####","pos":5},{"name":"+508 \ud83c\uddf5\ud83c\uddf2 - \u0421\u0435\u043d-\u041f\u044c\u0435\u0440 \u0438 \u041c\u0438\u043a\u0435\u043b\u043e\u043d","value":"+508-##-####","pos":5},{"name":"+590 \ud83c\uddec\ud83c\uddf5 - \u0413\u0432\u0430\u0434\u0435\u043b\u0443\u043f\u0430","value":"+590(###)###-###","pos":5},{"name":"+241 \ud83c\uddec\ud83c\udde6 - \u0413\u0430\u0431\u043e\u043d","value":"+241-#-##-##-##","pos":5},{"name":"+1473 \ud83c\uddec\ud83c\udde9 - \u0413\u0440\u0435\u043d\u0430\u0434\u0430","value":"+1(473)###-####","pos":7},{"name":"+594 \ud83c\uddec\ud83c\uddeb - \u0424\u0440. \u0413\u0432\u0438\u0430\u043d\u0430","value":"+594-#####-####","pos":5},{"name":"+233 \ud83c\uddec\ud83c\udded - \u0413\u0430\u043d\u0430","value":"+233(###)###-###","pos":5},{"name":"+350 \ud83c\uddec\ud83c\uddee - \u0413\u0438\u0431\u0440\u0430\u043b\u0442\u0430\u0440","value":"+350-###-#####","pos":5},{"name":"+299 \ud83c\uddec\ud83c\uddf1 - \u0413\u0440\u0435\u043d\u043b\u0430\u043d\u0434\u0438\u044f","value":"+299-##-##-##","pos":5},{"name":"+220 \ud83c\uddec\ud83c\uddf2 - \u0413\u0430\u043c\u0431\u0438\u044f","value":"+220(###)##-##","pos":5},{"name":"+224 \ud83c\uddec\ud83c\uddf3 - \u0413\u0432\u0438\u043d\u0435\u044f","value":"+224-##-###-###","pos":5},{"name":"+240 \ud83c\uddec\ud83c\uddf6 - \u042d\u043a\u0432\u0430\u0442\u043e\u0440\u0438\u0430\u043b\u044c\u043d\u0430\u044f \u0413\u0432\u0438\u043d\u0435\u044f","value":"+240-##-###-####","pos":5},{"name":"+30 \ud83c\uddec\ud83c\uddf7 - \u0413\u0440\u0435\u0446\u0438\u044f","value":"+30(###)###-####","pos":4},{"name":"+502 \ud83c\uddec\ud83c\uddf9 - \u0413\u0432\u0430\u0442\u0435\u043c\u0430\u043b\u0430","value":"+502-#-###-####","pos":5},{"name":"+1671 \ud83c\uddec\ud83c\uddfa - \u0413\u0443\u0430\u043c","value":"+1(671)###-####","pos":7},{"name":"+245 \ud83c\uddec\ud83c\uddfc - \u0413\u0432\u0438\u043d\u0435\u044f-\u0411\u0438\u0441\u0430\u0443","value":"+245-#-######","pos":5},{"name":"+592 \ud83c\uddec\ud83c\uddfe - \u0413\u0430\u0439\u0430\u043d\u0430","value":"+592-###-####","pos":5},{"name":"+852 \ud83c\udded\ud83c\uddf0 - \u0413\u043e\u043d\u043a\u043e\u043d\u0433","value":"+852-####-####","pos":5},{"name":"+504 \ud83c\udded\ud83c\uddf3 - \u0413\u043e\u043d\u0434\u0443\u0440\u0430\u0441","value":"+504-####-####","pos":5},{"name":"+385 \ud83c\udded\ud83c\uddf7 - \u0425\u043e\u0440\u0432\u0430\u0442\u0438\u044f","value":"+385-##-###-###","pos":5},{"name":"+509 \ud83c\udded\ud83c\uddf9 - \u0413\u0430\u0438\u0442\u0438","value":"+509-##-##-####","pos":5},{"name":"+36 \ud83c\udded\ud83c\uddfa - \u0412\u0435\u043d\u0433\u0440\u0438\u044f","value":"+36(###)###-###","pos":4},{"name":"+628 \ud83c\uddee\ud83c\udde9 - \u0418\u043d\u0434\u043e\u043d\u0435\u0437\u0438\u044f ","value":"+62(8##)###-####","pos":5},{"name":"+62 \ud83c\uddee\ud83c\udde9 - \u0418\u043d\u0434\u043e\u043d\u0435\u0437\u0438\u044f","value":"+62-##-###-##","pos":4},{"name":"+62 \ud83c\uddee\ud83c\udde9 - \u0418\u043d\u0434\u043e\u043d\u0435\u0437\u0438\u044f","value":"+62-##-###-###","pos":4},{"name":"+62 \ud83c\uddee\ud83c\udde9 - \u0418\u043d\u0434\u043e\u043d\u0435\u0437\u0438\u044f","value":"+62-##-###-####","pos":4},{"name":"+628 \ud83c\uddee\ud83c\udde9 - \u0418\u043d\u0434\u043e\u043d\u0435\u0437\u0438\u044f ","value":"+62(8##)###-###","pos":5},{"name":"+628 \ud83c\uddee\ud83c\udde9 - \u0418\u043d\u0434\u043e\u043d\u0435\u0437\u0438\u044f ","value":"+62(8##)###-##-###","pos":5},{"name":"+353 \ud83c\uddee\ud83c\uddea - \u0418\u0440\u043b\u0430\u043d\u0434\u0438\u044f","value":"+353(###)###-###","pos":5},{"name":"+9725 \ud83c\uddee\ud83c\uddf1 - \u0418\u0437\u0440\u0430\u0438\u043b\u044c ","value":"+972-5#-###-####","pos":6},{"name":"+972 \ud83c\uddee\ud83c\uddf1 - \u0418\u0437\u0440\u0430\u0438\u043b\u044c","value":"+972-#-###-####","pos":5},{"name":"+91 \ud83c\uddee\ud83c\uddf3 - \u0418\u043d\u0434\u0438\u044f","value":"+91(####)###-###","pos":4},{"name":"+246 \ud83c\udde9\ud83c\uddec - \u0414\u0438\u0435\u0433\u043e-\u0413\u0430\u0440\u0441\u0438\u044f","value":"+246-###-####","pos":5},{"name":"+964 \ud83c\uddee\ud83c\uddf6 - \u0418\u0440\u0430\u043a","value":"+964(###)###-####","pos":5},{"name":"+98 \ud83c\uddee\ud83c\uddf7 - \u0418\u0440\u0430\u043d","value":"+98(###)###-####","pos":4},{"name":"+354 \ud83c\uddee\ud83c\uddf8 - \u0418\u0441\u043b\u0430\u043d\u0434\u0438\u044f","value":"+354-###-####","pos":5},{"name":"+39 \ud83c\uddee\ud83c\uddf9 - \u0418\u0442\u0430\u043b\u0438\u044f","value":"+39(###)####-###","pos":4},{"name":"+1876 \ud83c\uddef\ud83c\uddf2 - \u042f\u043c\u0430\u0439\u043a\u0430","value":"+1(876)###-####","pos":7},{"name":"+962 \ud83c\uddef\ud83c\uddf4 - \u0418\u043e\u0440\u0434\u0430\u043d\u0438\u044f","value":"+962-#-####-####","pos":5},{"name":"+81 \ud83c\uddef\ud83c\uddf5 - \u042f\u043f\u043e\u043d\u0438\u044f ","value":"+81-##-####-####","pos":4},{"name":"+81 \ud83c\uddef\ud83c\uddf5 - \u042f\u043f\u043e\u043d\u0438\u044f","value":"+81(###)###-###","pos":4},{"name":"+254 \ud83c\uddf0\ud83c\uddea - \u041a\u0435\u043d\u0438\u044f","value":"+254-###-######","pos":5},{"name":"+855 \ud83c\uddf0\ud83c\udded - \u041a\u0430\u043c\u0431\u043e\u0434\u0436\u0430","value":"+855-##-###-###","pos":5},{"name":"+686 \ud83c\uddf0\ud83c\uddee - \u041a\u0438\u0440\u0438\u0431\u0430\u0442\u0438","value":"+686-##-###","pos":5},{"name":"+269 \ud83c\uddf0\ud83c\uddf2 - \u041a\u043e\u043c\u043e\u0440\u044b","value":"+269-##-#####","pos":5},{"name":"+1869 \ud83c\uddf0\ud83c\uddf3 - \u0421\u0435\u043d\u0442-\u041a\u0438\u0442\u0441 \u0438 \u041d\u0435\u0432\u0438\u0441","value":"+1(869)###-####","pos":7},{"name":"+850191 \ud83c\uddf0\ud83c\uddf3 - \u041a\u043e\u0440\u0435\u0439\u0441\u043a\u0430\u044f \u041d\u0414\u0420","value":"+850-191-###-####","pos":9},{"name":"+850 \ud83c\uddf0\ud83c\uddf5 - \u041a\u043e\u0440\u0435\u0439\u0441\u043a\u0430\u044f \u041d\u0414\u0420","value":"+850-##-###-###","pos":5},{"name":"+850 \ud83c\uddf0\ud83c\uddf5 - \u041a\u043e\u0440\u0435\u0439\u0441\u043a\u0430\u044f \u041d\u0414\u0420","value":"+850-###-####-###","pos":5},{"name":"+850 \ud83c\uddf0\ud83c\uddf5 - \u041a\u043e\u0440\u0435\u0439\u0441\u043a\u0430\u044f \u041d\u0414\u0420","value":"+850-###-###","pos":5},{"name":"+850 \ud83c\uddf0\ud83c\uddf5 - \u041a\u043e\u0440\u0435\u0439\u0441\u043a\u0430\u044f \u041d\u0414\u0420","value":"+850-####-####","pos":5},{"name":"+850 \ud83c\uddf0\ud83c\uddf5 - \u041a\u043e\u0440\u0435\u0439\u0441\u043a\u0430\u044f \u041d\u0414\u0420","value":"+850-####-#############","pos":5},{"name":"+82 \ud83c\uddf0\ud83c\uddf7 - \u0420\u0435\u0441\u043f. \u041a\u043e\u0440\u0435\u044f","value":"+82-##-###-####","pos":4},{"name":"+965 \ud83c\uddf0\ud83c\uddfc - \u041a\u0443\u0432\u0435\u0439\u0442","value":"+965-####-####","pos":5},{"name":"+1345 \ud83c\uddf0\ud83c\uddfe - \u041a\u0430\u0439\u043c\u0430\u043d\u043e\u0432\u044b \u043e\u0441\u0442\u0440\u043e\u0432\u0430","value":"+1(345)###-####","pos":7},{"name":"+76 \ud83c\uddf0\ud83c\uddff - \u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d","value":"+7(6##)###-##-##","pos":4},{"name":"+77 \ud83c\uddf0\ud83c\uddff - \u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d","value":"+7(7##)###-##-##","pos":4},{"name":"+85620 \ud83c\uddf1\ud83c\udde6 - \u041b\u0430\u043e\u0441","value":"+856(20##)###-###","pos":7},{"name":"+856 \ud83c\uddf1\ud83c\udde6 - \u041b\u0430\u043e\u0441","value":"+856-##-###-###","pos":5},{"name":"+961 \ud83c\uddf1\ud83c\udde7 - \u041b\u0438\u0432\u0430\u043d ","value":"+961-##-###-###","pos":5},{"name":"+961 \ud83c\uddf1\ud83c\udde7 - \u041b\u0438\u0432\u0430\u043d","value":"+961-#-###-###","pos":5},{"name":"+1758 \ud83c\uddf1\ud83c\udde8 - \u0421\u0435\u043d\u0442-\u041b\u044e\u0441\u0438\u044f","value":"+1(758)###-####","pos":7},{"name":"+423 \ud83c\uddf1\ud83c\uddee - \u041b\u0438\u0445\u0442\u0435\u043d\u0448\u0442\u0435\u0439\u043d","value":"+423(###)###-####","pos":5},{"name":"+94 \ud83c\uddf1\ud83c\uddf0 - \u0428\u0440\u0438-\u041b\u0430\u043d\u043a\u0430","value":"+94-##-###-####","pos":4},{"name":"+231 \ud83c\uddf1\ud83c\uddf7 - \u041b\u0438\u0431\u0435\u0440\u0438\u044f","value":"+231-##-###-###","pos":5},{"name":"+266 \ud83c\uddf1\ud83c\uddf8 - \u041b\u0435\u0441\u043e\u0442\u043e","value":"+266-#-###-####","pos":5},{"name":"+370 \ud83c\uddf1\ud83c\uddf9 - \u041b\u0438\u0442\u0432\u0430","value":"+370(###)##-###","pos":5},{"name":"+352 \ud83c\uddf1\ud83c\uddfa - \u041b\u044e\u043a\u0441\u0435\u043c\u0431\u0443\u0440\u0433","value":"+352(###)###-###","pos":5},{"name":"+218 \ud83c\uddf1\ud83c\uddfe - \u041b\u0438\u0432\u0438\u044f","value":"+218-##-###-###","pos":5},{"name":"+21821 \ud83c\uddf1\ud83c\uddfe - \u041b\u0438\u0432\u0438\u044f","value":"+218-21-###-####","pos":8},{"name":"+212 \ud83c\uddf2\ud83c\udde6 - \u041c\u0430\u0440\u043e\u043a\u043a\u043e","value":"+212-##-####-###","pos":5},{"name":"+377 \ud83c\uddf2\ud83c\udde8 - \u041c\u043e\u043d\u0430\u043a\u043e","value":"+377(###)###-###","pos":5},{"name":"+377 \ud83c\uddf2\ud83c\udde8 - \u041c\u043e\u043d\u0430\u043a\u043e","value":"+377-##-###-###","pos":5},{"name":"+382 \ud83c\uddf2\ud83c\uddea - \u0427\u0435\u0440\u043d\u043e\u0433\u043e\u0440\u0438\u044f","value":"+382-##-###-###","pos":5},{"name":"+261 \ud83c\uddf2\ud83c\uddec - \u041c\u0430\u0434\u0430\u0433\u0430\u0441\u043a\u0430\u0440","value":"+261-##-##-#####","pos":5},{"name":"+692 \ud83c\uddf2\ud83c\udded - \u041c\u0430\u0440\u0448\u0430\u043b\u043b\u043e\u0432\u044b \u041e\u0441\u0442\u0440\u043e\u0432\u0430","value":"+692-###-####","pos":5},{"name":"+389 \ud83c\uddf2\ud83c\uddf0 - \u0420\u0435\u0441\u043f. \u041c\u0430\u043a\u0435\u0434\u043e\u043d\u0438\u044f","value":"+389-##-###-###","pos":5},{"name":"+223 \ud83c\uddf2\ud83c\uddf1 - \u041c\u0430\u043b\u0438","value":"+223-##-##-####","pos":5},{"name":"+95 \ud83c\uddf2\ud83c\uddf2 - \u0411\u0438\u0440\u043c\u0430 (\u041c\u044c\u044f\u043d\u043c\u0430)","value":"+95-##-###-###","pos":4},{"name":"+95 \ud83c\uddf2\ud83c\uddf2 - \u0411\u0438\u0440\u043c\u0430 (\u041c\u044c\u044f\u043d\u043c\u0430)","value":"+95-#-###-###","pos":4},{"name":"+95 \ud83c\uddf2\ud83c\uddf2 - \u0411\u0438\u0440\u043c\u0430 (\u041c\u044c\u044f\u043d\u043c\u0430)","value":"+95-###-###","pos":4},{"name":"+976 \ud83c\uddf2\ud83c\uddf3 - \u041c\u043e\u043d\u0433\u043e\u043b\u0438\u044f","value":"+976-##-##-####","pos":5},{"name":"+853 \ud83c\uddf2\ud83c\uddf4 - \u041c\u0430\u043a\u0430\u043e","value":"+853-####-####","pos":5},{"name":"+1670 \ud83c\uddf2\ud83c\uddf5 - \u0421\u0435\u0432\u0435\u0440\u043d\u044b\u0435 \u041c\u0430\u0440\u0438\u0430\u043d\u0441\u043a\u0438\u0435 \u043e\u0441\u0442\u0440\u043e\u0432\u0430 \u0421\u0430\u0439\u043f\u0430\u043d","value":"+1(670)###-####","pos":7},{"name":"+596 \ud83c\uddf2\ud83c\uddf6 - \u041c\u0430\u0440\u0442\u0438\u043d\u0438\u043a\u0430","value":"+596(###)##-##-##","pos":5},{"name":"+222 \ud83c\uddf2\ud83c\uddf7 - \u041c\u0430\u0432\u0440\u0438\u0442\u0430\u043d\u0438\u044f","value":"+222-##-##-####","pos":5},{"name":"+1664 \ud83c\uddf2\ud83c\uddf8 - \u041c\u043e\u043d\u0442\u0441\u0435\u0440\u0440\u0430\u0442","value":"+1(664)###-####","pos":7},{"name":"+356 \ud83c\uddf2\ud83c\uddf9 - \u041c\u0430\u043b\u044c\u0442\u0430","value":"+356-####-####","pos":5},{"name":"+230 \ud83c\uddf2\ud83c\uddfa - \u041c\u0430\u0432\u0440\u0438\u043a\u0438\u0439","value":"+230-###-####","pos":5},{"name":"+960 \ud83c\uddf2\ud83c\uddfb - \u041c\u0430\u043b\u044c\u0434\u0438\u0432\u0441\u043a\u0438\u0435 \u043e\u0441\u0442\u0440\u043e\u0432\u0430","value":"+960-###-####","pos":5},{"name":"+2651 \ud83c\uddf2\ud83c\uddfc - \u041c\u0430\u043b\u0430\u0432\u0438","value":"+265-1-###-###","pos":7},{"name":"+265 \ud83c\uddf2\ud83c\uddfc - \u041c\u0430\u043b\u0430\u0432\u0438","value":"+265-#-####-####","pos":5},{"name":"+52 \ud83c\uddf2\ud83c\uddfd - \u041c\u0435\u043a\u0441\u0438\u043a\u0430","value":"+52(###)###-####","pos":4},{"name":"+52 \ud83c\uddf2\ud83c\uddfd - \u041c\u0435\u043a\u0441\u0438\u043a\u0430","value":"+52-##-##-####","pos":4},{"name":"+60 \ud83c\uddf2\ud83c\uddfe - \u041c\u0430\u043b\u0430\u0439\u0437\u0438\u044f ","value":"+60-##-###-####","pos":4},{"name":"+60 \ud83c\uddf2\ud83c\uddfe - \u041c\u0430\u043b\u0430\u0439\u0437\u0438\u044f","value":"+60(###)###-###","pos":4},{"name":"+60 \ud83c\uddf2\ud83c\uddfe - \u041c\u0430\u043b\u0430\u0439\u0437\u0438\u044f","value":"+60-##-###-###","pos":4},{"name":"+60 \ud83c\uddf2\ud83c\uddfe - \u041c\u0430\u043b\u0430\u0439\u0437\u0438\u044f","value":"+60-#-###-###","pos":4},{"name":"+258 \ud83c\uddf2\ud83c\uddff - \u041c\u043e\u0437\u0430\u043c\u0431\u0438\u043a","value":"+258-##-###-###","pos":5},{"name":"+264 \ud83c\uddf3\ud83c\udde6 - \u041d\u0430\u043c\u0438\u0431\u0438\u044f","value":"+264-##-###-####","pos":5},{"name":"+687 \ud83c\uddf3\ud83c\udde8 - \u041d\u043e\u0432\u0430\u044f \u041a\u0430\u043b\u0435\u0434\u043e\u043d\u0438\u044f","value":"+687-##-####","pos":5},{"name":"+227 \ud83c\uddf3\ud83c\uddea - \u041d\u0438\u0433\u0435\u0440","value":"+227-##-##-####","pos":5},{"name":"+6723 \ud83c\uddf3\ud83c\uddeb - \u041d\u043e\u0440\u0444\u043e\u043b\u043a (\u043e\u0441\u0442\u0440\u043e\u0432)","value":"+672-3##-###","pos":6},{"name":"+234 \ud83c\uddf3\ud83c\uddec - \u041d\u0438\u0433\u0435\u0440\u0438\u044f","value":"+234(###)###-####","pos":5},{"name":"+234 \ud83c\uddf3\ud83c\uddec - \u041d\u0438\u0433\u0435\u0440\u0438\u044f","value":"+234-##-###-###","pos":5},{"name":"+234 \ud83c\uddf3\ud83c\uddec - \u041d\u0438\u0433\u0435\u0440\u0438\u044f","value":"+234-##-###-##","pos":5},{"name":"+234 \ud83c\uddf3\ud83c\uddec - \u041d\u0438\u0433\u0435\u0440\u0438\u044f ","value":"+234(###)###-####","pos":5},{"name":"+505 \ud83c\uddf3\ud83c\uddee - \u041d\u0438\u043a\u0430\u0440\u0430\u0433\u0443\u0430","value":"+505-####-####","pos":5},{"name":"+31 \ud83c\uddf3\ud83c\uddf1 - \u041d\u0438\u0434\u0435\u0440\u043b\u0430\u043d\u0434\u044b","value":"+31-##-###-####","pos":4},{"name":"+47 \ud83c\uddf3\ud83c\uddf4 - \u041d\u043e\u0440\u0432\u0435\u0433\u0438\u044f","value":"+47(###)##-###","pos":4},{"name":"+977 \ud83c\uddf3\ud83c\uddf5 - \u041d\u0435\u043f\u0430\u043b","value":"+977-##-###-###","pos":5},{"name":"+674 \ud83c\uddf3\ud83c\uddf7 - \u041d\u0430\u0443\u0440\u0443","value":"+674-###-####","pos":5},{"name":"+683 \ud83c\uddf3\ud83c\uddfa - \u041d\u0438\u0443\u044d","value":"+683-####","pos":5},{"name":"+64 \ud83c\uddf3\ud83c\uddff - \u041d\u043e\u0432\u0430\u044f \u0417\u0435\u043b\u0430\u043d\u0434\u0438\u044f","value":"+64(###)###-###","pos":4},{"name":"+64 \ud83c\uddf3\ud83c\uddff - \u041d\u043e\u0432\u0430\u044f \u0417\u0435\u043b\u0430\u043d\u0434\u0438\u044f","value":"+64-##-###-###","pos":4},{"name":"+64 \ud83c\uddf3\ud83c\uddff - \u041d\u043e\u0432\u0430\u044f \u0417\u0435\u043b\u0430\u043d\u0434\u0438\u044f","value":"+64(###)###-####","pos":4},{"name":"+968 \ud83c\uddf4\ud83c\uddf2 - \u041e\u043c\u0430\u043d","value":"+968-##-###-###","pos":5},{"name":"+507 \ud83c\uddf5\ud83c\udde6 - \u041f\u0430\u043d\u0430\u043c\u0430","value":"+507-###-####","pos":5},{"name":"+51 \ud83c\uddf5\ud83c\uddea - \u041f\u0435\u0440\u0443","value":"+51(###)###-###","pos":4},{"name":"+689 \ud83c\uddf5\ud83c\uddeb - \u0424\u0440\u0430\u043d\u0446\u0443\u0437\u0441\u043a\u0430\u044f \u041f\u043e\u043b\u0438\u043d\u0435\u0437\u0438\u044f (\u0422\u0430\u0438\u0442\u0438)","value":"+689-##-##-##","pos":5},{"name":"+675 \ud83c\uddf5\ud83c\uddec - \u041f\u0430\u043f\u0443\u0430-\u041d\u043e\u0432\u0430\u044f \u0413\u0432\u0438\u043d\u0435\u044f","value":"+675(###)##-###","pos":5},{"name":"+63 \ud83c\uddf5\ud83c\udded - \u0424\u0438\u043b\u0438\u043f\u043f\u0438\u043d\u044b","value":"+63(###)###-####","pos":4},{"name":"+92 \ud83c\uddf5\ud83c\uddf0 - \u041f\u0430\u043a\u0438\u0441\u0442\u0430\u043d","value":"+92(###)###-####","pos":4},{"name":"+48 \ud83c\uddf5\ud83c\uddf1 - \u041f\u043e\u043b\u044c\u0448\u0430","value":"+48(###)###-###","pos":4},{"name":"+970 \ud83c\uddf5\ud83c\uddf8 - \u041f\u0430\u043b\u0435\u0441\u0442\u0438\u043d\u0430","value":"+970-##-###-####","pos":5},{"name":"+351 \ud83c\uddf5\ud83c\uddf9 - \u041f\u043e\u0440\u0442\u0443\u0433\u0430\u043b\u0438\u044f","value":"+351-##-###-####","pos":5},{"name":"+680 \ud83c\uddf5\ud83c\uddfc - \u041f\u0430\u043b\u0430\u0443","value":"+680-###-####","pos":5},{"name":"+595 \ud83c\uddf5\ud83c\uddfe - \u041f\u0430\u0440\u0430\u0433\u0432\u0430\u0439","value":"+595(###)###-###","pos":5},{"name":"+974 \ud83c\uddf6\ud83c\udde6 - \u041a\u0430\u0442\u0430\u0440","value":"+974-####-####","pos":5},{"name":"+262 \ud83c\uddf7\ud83c\uddea - \u0420\u0435\u044e\u043d\u044c\u043e\u043d","value":"+262-#####-####","pos":5},{"name":"+40 \ud83c\uddf7\ud83c\uddf4 - \u0420\u0443\u043c\u044b\u043d\u0438\u044f","value":"+40-##-###-####","pos":4},{"name":"+381 \ud83c\uddf7\ud83c\uddf8 - \u0421\u0435\u0440\u0431\u0438\u044f","value":"+381-##-###-####","pos":5},{"name":"+250 \ud83c\uddf7\ud83c\uddfc - \u0420\u0443\u0430\u043d\u0434\u0430","value":"+250(###)###-###","pos":5},{"name":"+9665 \ud83c\uddf8\ud83c\udde6 - \u0421\u0430\u0443\u0434\u043e\u0432\u0441\u043a\u0430\u044f \u0410\u0440\u0430\u0432\u0438\u044f ","value":"+966-5-####-####","pos":7},{"name":"+966 \ud83c\uddf8\ud83c\udde6 - \u0421\u0430\u0443\u0434\u043e\u0432\u0441\u043a\u0430\u044f \u0410\u0440\u0430\u0432\u0438\u044f","value":"+966-#-###-####","pos":5},{"name":"+677 \ud83c\uddf8\ud83c\udde7 - \u0421\u043e\u043b\u043e\u043c\u043e\u043d\u043e\u0432\u044b \u041e\u0441\u0442\u0440\u043e\u0432\u0430 ","value":"+677-###-####","pos":5},{"name":"+677 \ud83c\uddf8\ud83c\udde7 - \u0421\u043e\u043b\u043e\u043c\u043e\u043d\u043e\u0432\u044b \u041e\u0441\u0442\u0440\u043e\u0432\u0430","value":"+677-#####","pos":5},{"name":"+248 \ud83c\uddf8\ud83c\udde8 - \u0421\u0435\u0439\u0448\u0435\u043b\u044b","value":"+248-#-###-###","pos":5},{"name":"+249 \ud83c\uddf8\ud83c\udde9 - \u0421\u0443\u0434\u0430\u043d","value":"+249-##-###-####","pos":5},{"name":"+46 \ud83c\uddf8\ud83c\uddea - \u0428\u0432\u0435\u0446\u0438\u044f","value":"+46-##-###-####","pos":4},{"name":"+6565 \ud83c\uddf8\ud83c\uddec - \u0421\u0438\u043d\u0433\u0430\u043f\u0443\u0440","value":"+65 65 #######","pos":7},{"name":"+290 \ud83c\uddf8\ud83c\udded - \u041e\u0441\u0442\u0440\u043e\u0432 \u0421\u0432\u044f\u0442\u043e\u0439 \u0415\u043b\u0435\u043d\u044b","value":"+290-####","pos":5},{"name":"+290 \ud83c\uddf9\ud83c\udde6 - \u0422\u0440\u0438\u0441\u0442\u0430\u043d-\u0434\u0430-\u041a\u0443\u043d\u044c\u044f","value":"+290-####","pos":5},{"name":"+386 \ud83c\uddf8\ud83c\uddee - \u0421\u043b\u043e\u0432\u0435\u043d\u0438\u044f","value":"+386-##-###-###","pos":5},{"name":"+421 \ud83c\uddf8\ud83c\uddf0 - \u0421\u043b\u043e\u0432\u0430\u043a\u0438\u044f","value":"+421(###)###-###","pos":5},{"name":"+232 \ud83c\uddf8\ud83c\uddf1 - \u0421\u044c\u0435\u0440\u0440\u0430-\u041b\u0435\u043e\u043d\u0435","value":"+232-##-######","pos":5},{"name":"+378 \ud83c\uddf8\ud83c\uddf2 - \u0421\u0430\u043d-\u041c\u0430\u0440\u0438\u043d\u043e","value":"+378-####-######","pos":5},{"name":"+221 \ud83c\uddf8\ud83c\uddf3 - \u0421\u0435\u043d\u0435\u0433\u0430\u043b","value":"+221-##-###-####","pos":5},{"name":"+252 \ud83c\uddf8\ud83c\uddf4 - \u0421\u043e\u043c\u0430\u043b\u0438","value":"+252-##-###-###","pos":5},{"name":"+252 \ud83c\uddf8\ud83c\uddf4 - \u0421\u043e\u043c\u0430\u043b\u0438","value":"+252-#-###-###","pos":5},{"name":"+252 \ud83c\uddf8\ud83c\uddf4 - \u0421\u043e\u043c\u0430\u043b\u0438","value":"+252-#-###-###","pos":5},{"name":"+597 \ud83c\uddf8\ud83c\uddf7 - \u0421\u0443\u0440\u0438\u043d\u0430\u043c","value":"+597-###-####","pos":5},{"name":"+597 \ud83c\uddf8\ud83c\uddf7 - \u0421\u0443\u0440\u0438\u043d\u0430\u043c","value":"+597-###-###","pos":5},{"name":"+211 \ud83c\uddf8\ud83c\uddf8 - \u042e\u0436\u043d\u044b\u0439 \u0421\u0443\u0434\u0430\u043d","value":"+211-##-###-####","pos":5},{"name":"+239 \ud83c\uddf8\ud83c\uddf9 - \u0421\u0430\u043d-\u0422\u043e\u043c\u0435 \u0438 \u041f\u0440\u0438\u043d\u0441\u0438\u043f\u0438","value":"+239-##-#####","pos":5},{"name":"+503 \ud83c\uddf8\ud83c\uddfb - \u0421\u0430\u043b\u044c\u0432\u0430\u0434\u043e\u0440","value":"+503-##-##-####","pos":5},{"name":"+1721 \ud83c\uddf8\ud83c\uddfd - \u0421\u0438\u043d\u0442-\u041c\u0430\u0430\u0440\u0442\u0435\u043d","value":"+1(721)###-####","pos":7},{"name":"+963 \ud83c\uddf8\ud83c\uddfe - \u0421\u0438\u0440\u0438\u044f (\u0421\u0438\u0440\u0438\u0439\u0441\u043a\u0430\u044f \u0430\u0440\u0430\u0431\u0441\u043a\u0430\u044f \u0440\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430)","value":"+963-##-####-###","pos":5},{"name":"+268 \ud83c\uddf8\ud83c\uddff - \u0421\u0432\u0430\u0437\u0438\u043b\u0435\u043d\u0434","value":"+268-##-##-####","pos":5},{"name":"+1649 \ud83c\uddf9\ud83c\udde8 - \u0422\u0451\u0440\u043a\u0441 \u0438 \u041a\u0430\u0439\u043a\u043e\u0441","value":"+1(649)###-####","pos":7},{"name":"+235 \ud83c\uddf9\ud83c\udde9 - \u0427\u0430\u0434","value":"+235-##-##-##-##","pos":5},{"name":"+228 \ud83c\uddf9\ud83c\uddec - \u0422\u043e\u0433\u043e","value":"+228-##-###-###","pos":5},{"name":"+66 \ud83c\uddf9\ud83c\udded - \u0422\u0430\u0438\u043b\u0430\u043d\u0434 ","value":"+66-##-###-####","pos":4},{"name":"+66 \ud83c\uddf9\ud83c\udded - \u0422\u0430\u0438\u043b\u0430\u043d\u0434","value":"+66-##-###-###","pos":4},{"name":"+690 \ud83c\uddf9\ud83c\uddf0 - \u0422\u043e\u043a\u0435\u043b\u0430\u0443","value":"+690-####","pos":5},{"name":"+670 \ud83c\uddf9\ud83c\uddf1 - \u0412\u043e\u0441\u0442\u043e\u0447\u043d\u044b\u0439 \u0422\u0438\u043c\u043e\u0440","value":"+670-###-####","pos":5},{"name":"+67077 \ud83c\uddf9\ud83c\uddf1 - \u0412\u043e\u0441\u0442\u043e\u0447\u043d\u044b\u0439 \u0422\u0438\u043c\u043e\u0440","value":"+670-77#-#####","pos":7},{"name":"+67078 \ud83c\uddf9\ud83c\uddf1 - \u0412\u043e\u0441\u0442\u043e\u0447\u043d\u044b\u0439 \u0422\u0438\u043c\u043e\u0440","value":"+670-78#-#####","pos":7},{"name":"+216 \ud83c\uddf9\ud83c\uddf3 - \u0422\u0443\u043d\u0438\u0441","value":"+216-##-###-###","pos":5},{"name":"+676 \ud83c\uddf9\ud83c\uddf4 - \u0422\u043e\u043d\u0433\u0430","value":"+676-#####","pos":5},{"name":"+90 \ud83c\uddf9\ud83c\uddf7 - \u0422\u0443\u0440\u0446\u0438\u044f","value":"+90(###)###-####","pos":4},{"name":"+1868 \ud83c\uddf9\ud83c\uddf9 - \u0422\u0440\u0438\u043d\u0438\u0434\u0430\u0434 \u0438 \u0422\u043e\u0431\u0430\u0433\u043e","value":"+1(868)###-####","pos":7},{"name":"+68890 \ud83c\uddf9\ud83c\uddfb - \u0422\u0443\u0432\u0430\u043b\u0443 ","value":"+688-90####","pos":7},{"name":"+6882 \ud83c\uddf9\ud83c\uddfb - \u0422\u0443\u0432\u0430\u043b\u0443","value":"+688-2####","pos":6},{"name":"+886 \ud83c\uddf9\ud83c\uddfc - \u0422\u0430\u0439\u0432\u0430\u043d\u044c","value":"+886-#-####-####","pos":5},{"name":"+886 \ud83c\uddf9\ud83c\uddfc - \u0422\u0430\u0439\u0432\u0430\u043d\u044c","value":"+886-####-####","pos":5},{"name":"+255 \ud83c\uddf9\ud83c\uddff - \u0422\u0430\u043d\u0437\u0430\u043d\u0438\u044f","value":"+255-##-###-####","pos":5},{"name":"+256 \ud83c\uddfa\ud83c\uddec - \u0423\u0433\u0430\u043d\u0434\u0430","value":"+256(###)###-###","pos":5},{"name":"+598 \ud83c\uddfa\ud83c\uddfe - \u0423\u0440\u0443\u0433\u0432\u0430\u0439","value":"+598-#-###-##-##","pos":5},{"name":"+396698 \ud83c\uddfb\ud83c\udde6 - \u0412\u0430\u0442\u0438\u043a\u0430\u043d","value":"+39-6-698-#####","pos":10},{"name":"+1784 \ud83c\uddfb\ud83c\udde8 - \u0421\u0435\u043d\u0442-\u0412\u0438\u043d\u0441\u0435\u043d\u0442 \u0438 \u0413\u0440\u0435\u043d\u0430\u0434\u0438\u043d\u044b","value":"+1(784)###-####","pos":7},{"name":"+58 \ud83c\uddfb\ud83c\uddea - \u0412\u0435\u043d\u0435\u0441\u0443\u044d\u043b\u0430","value":"+58(###)###-####","pos":4},{"name":"+1284 \ud83c\uddfb\ud83c\uddec - \u0411\u0440\u0438\u0442\u0430\u043d\u0441\u043a\u0438\u0435 \u0412\u0438\u0440\u0433\u0438\u043d\u0441\u043a\u0438\u0435 \u043e\u0441\u0442\u0440\u043e\u0432\u0430","value":"+1(284)###-####","pos":7},{"name":"+1340 \ud83c\uddfb\ud83c\uddee - \u0410\u043c\u0435\u0440\u0438\u043a\u0430\u043d\u0441\u043a\u0438\u0435 \u0412\u0438\u0440\u0433\u0438\u043d\u0441\u043a\u0438\u0435 \u043e\u0441\u0442\u0440\u043e\u0432\u0430","value":"+1(340)###-####","pos":7},{"name":"+84 \ud83c\uddfb\ud83c\uddf3 - \u0412\u044c\u0435\u0442\u043d\u0430\u043c","value":"+84-##-####-###","pos":4},{"name":"+84 \ud83c\uddfb\ud83c\uddf3 - \u0412\u044c\u0435\u0442\u043d\u0430\u043c","value":"+84(###)####-###","pos":4},{"name":"+678 \ud83c\uddfb\ud83c\uddfa - \u0412\u0430\u043d\u0443\u0430\u0442\u0443 ","value":"+678-##-#####","pos":5},{"name":"+678 \ud83c\uddfb\ud83c\uddfa - \u0412\u0430\u043d\u0443\u0430\u0442\u0443","value":"+678-#####","pos":5},{"name":"+681 \ud83c\uddfc\ud83c\uddeb - \u0423\u043e\u043b\u043b\u0438\u0441 \u0438 \u0424\u0443\u0442\u0443\u043d\u0430","value":"+681-##-####","pos":5},{"name":"+685 \ud83c\uddfc\ud83c\uddf8 - \u0421\u0430\u043c\u043e\u0430","value":"+685-##-####","pos":5},{"name":"+967 \ud83c\uddfe\ud83c\uddea - \u0419\u0435\u043c\u0435\u043d ","value":"+967-###-###-###","pos":5},{"name":"+967 \ud83c\uddfe\ud83c\uddea - \u0419\u0435\u043c\u0435\u043d","value":"+967-#-###-###","pos":5},{"name":"+967 \ud83c\uddfe\ud83c\uddea - \u0419\u0435\u043c\u0435\u043d","value":"+967-##-###-###","pos":5},{"name":"+27 \ud83c\uddff\ud83c\udde6 - \u042e\u0436\u043d\u043e-\u0410\u0444\u0440\u0438\u043a\u0430\u043d\u0441\u043a\u0430\u044f \u0420\u0435\u0441\u043f.","value":"+27-##-###-####","pos":4},{"name":"+260 \ud83c\uddff\ud83c\uddf2 - \u0417\u0430\u043c\u0431\u0438\u044f","value":"+260-##-###-####","pos":5},{"name":"+263 \ud83c\uddff\ud83c\uddfc - \u0417\u0438\u043c\u0431\u0430\u0431\u0432\u0435","value":"+263-#-######","pos":5}]');
            let codeSelect = $('<select class="cus_sel"></select>');

            $(codes).each(function () {
                let code = $(this)[0];
                codeSelect.append('<option pos="' + code.pos + '" value="' + code.value + '">' + code.name + '</option>');
            });

            $.fn.setCursorPosition = function (pos) {
                if ($(this).get(0).setSelectionRange) {
                    $(this).get(0).setSelectionRange(pos, pos);
                } else if ($(this).get(0).createTextRange) {
                    var range = $(this).get(0).createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', pos);
                    range.moveStart('character', pos);
                    range.select();
                }
            };

            $.mask.definitions['#'] = "[0-9]";
            $.mask.definitions['9'] = null;

            let inputPhone = $widgetSettings.find('input[name="phone"]');
            inputPhone.mask('+7 (###) ###-##-##');
            inputPhone.before(codeSelect);
            inputPhone.before('<br>');

            inputPhone.click(function () {
                let pos = codeSelect.find('option:selected').attr('pos');
                $(this).setCursorPosition(pos);
            });

            codeSelect.on('change', function () {
                inputPhone.mask($(this).val());
            });
        };
        this.callbacks = {
            onSave: function (data) {
                return true;
            },
            render: function () {
                if (AMOCRM.data.current_entity === 'contacts') {
                    self.pipelineOption = [
                        {id: 'Контакты', option: 'Контакты'},
                        {id: 'Компании', option: 'Компании'},
                        {id: 'Все контакты и компании', option: 'Все контакты и компании'},
                    ];
                    self.renderSelect();
                    self.callbacks.bind_actions();
                    return true;
                }
                if (AMOCRM.data.current_entity === 'leads') {
                    $.get('/api/v4/leads/pipelines',
                        function (result) {
                            pipl = result['_embedded'].pipelines;
                            self.pipelineOption = [];
                            pipl.forEach(function (item) {
                                if (item['is_archive'] === false) self.pipelineOption.push({
                                    id: item['name'],
                                    option: item['name']
                                });
                            });
                            self.renderSelect();
                            self.callbacks.bind_actions();
                        }, "json");
                }
                return true;
            },
            bind_actions: function () {
                $("#save_pipeline").click(function () {
                    $("#save_pipeline").addClass('button-input-disabled');
                    var titleColumn = $('.cell-head__title');
                    var columns_id = [];
                    for (i = 0; i < titleColumn.length; i++) {
                        columns_id.push(titleColumn.eq(i).closest('.list-row__cell').attr("data-field-code"));
                    }
                    $.ajax({
                        url: 'https://munir.salesup.pro/api/set-pipeline-column',
                        method: 'post',
                        data: {
                            account_id: AMOCRM.constant('account').id,
                            pipeline_id: $('#pipeline_select').val(),
                            columns_id: columns_id,
                        },
                    }).fail(function (data) {
                    });
                    location.reload();
                });
                $('#pipeline_select').change(function () {
                    var titleTable = $('.list-row__cell');
                    if (titleTable.length) titleTable.show();
                    $("#save_pipeline").removeClass('button-input-disabled');
                });
                return true;
            },

            init: function () {
                return true;
            },
            //Вызывается при щелчкена иконку виджета в облсти настроек
            settings: function ($modal_body) { //$modal_body - jquery-объект блока правой части модального окна виджета
                $modal_body.find('input[name="oferta"]').val('');

                let html = '<div class = "oferta">' +
                    '    <label class="oferta_title"><input class="agreeinp" type= "checkbox" name="oferta_check" />Подтвердите согласие на передачу данных аккаунта на сторонний сервер</label>' +
                    '    <div class = "oferta_error text-danger hidden" >Необходимо дать согласие</div>' +
                    '</div>';

                let parent = $modal_body.find('.js-widget-save').parent();
                parent.before(html);

                let sett = $modal_body.find('.widget-settings-block__desc-expander');
                let settings = self.get_settings();
                sett.after("<div class='support'>" +
                    "<div class='s_left'>" +
                    "<div class='s_title'>Есть вопросы? Напишите нам =)</div>" +
                    "<div class='s_icons'>" +
                    "<div class='s_icon'><a href='https://vk.com/russia_salesup' target='_blank'><img src=" + settings.path + '/images/vk.png?v=' + settings.version + "/></a></div>" +
                    "<div class='s_icon'><a href='https://www.youtube.com/channel/UCrT_zl0bcML-IR-ijU-zOTg/' target='_blank'><img src=" + settings.path + '/images/yt.png?v=' + settings.version + "/></a></div>" +
                    "<div class='s_icon'><a href='https://t.me/+79779480614/' target='_blank'><img src=" + settings.path + '/images/tg.png?v=' + settings.version + "/></a></div>" +
                    "<div class='s_icon'><a href='https://wa.me/74992815250/' target='_blank'><img src=" + settings.path + '/images/wa.png?v=' + settings.version + "/></a></div>" +
                    "</div>" +
                    "</div>" +
                    "<div class='s_clear'></div>" +
                    "<div class='s_line'></div>" +
                    "</div>" +
                    "<style>" +
                    ".outline {\n" +
                    "    outline: 1px solid black;\n" +
                    "}\n" +
                    "\n" +
                    ".su-control-select-box {\n" +
                    "    display: none;\n" +
                    "    background: white;\n" +
                    "    position: absolute;\n" +
                    "    border: 1px solid #dfdfdf;\n" +
                    "    width: 100%;\n" +
                    "    z-index: 30;\n" +
                    "    left: -23px;\n" +
                    "    top: -2px;\n" +
                    "    padding-right: 13px;\n" +
                    "}\n" +
                    "\n" +
                    ".su-control-select-button {\n" +
                    "    color: #848c90;\n" +
                    "    background: white;\n" +
                    "    padding-right: 15px;\n" +
                    "    position: relative;\n" +
                    "    padding-left: 0;\n" +
                    "    height: 100%;\n" +
                    "}\n" +
                    "\n" +
                    ".text-black {\n" +
                    "    color: black !important;\n" +
                    "}\n" +
                    "\n" +
                    ".su-control-select-button:after {\n" +
                    "    border-bottom: 1px solid #848c90;\n" +
                    "    border-right: 1px solid #848c90;\n" +
                    "    right: 2px;\n" +
                    "    content: \"\";\n" +
                    "    position: absolute;\n" +
                    "    top: calc(50% - 5px);\n" +
                    "    width: 6px;\n" +
                    "    height: 6px;\n" +
                    "    -webkit-transform: rotate(45deg);\n" +
                    "    transform: rotate(45deg);\n" +
                    "    margin-left: 7px;\n" +
                    "    z-index: 10;\n" +
                    "}\n" +
                    "\n" +
                    ".su-select-list-item {\n" +
                    "    cursor: pointer;\n" +
                    "    position: relative;\n" +
                    "    list-style-type: none;\n" +
                    "    padding: 8px 6px 7px 0;\n" +
                    "    margin: 0 -11px 0 0;\n" +
                    "    overflow: hidden;\n" +
                    "    box-sizing: border-box;\n" +
                    "    width: calc(100% + 13px);\n" +
                    "}\n" +
                    "\n" +
                    ".su-select-list-item-selected {\n" +
                    "    background-image: url('https://salesup.tech/amo/vladimir/www/images/check.svg');\n" +
                    "    background-size: 20px 20px;\n" +
                    "    background-position: left center;\n" +
                    "    background-repeat: no-repeat;\n" +
                    "    background-color: #F5F5F5;\n" +
                    "}\n" +
                    "\n" +
                    ".su-select-list-item-selected:hover {\n" +
                    "    background-color: #EDEDED;\n" +
                    "}\n" +
                    "\n" +
                    ".su-select-list-item:hover {\n" +
                    "    background-color: #F2F2F2;\n" +
                    "}\n" +
                    "\n" +
                    ".su-select-list-item-inner {\n" +
                    "    position: relative;\n" +
                    "    display: block;\n" +
                    "    padding-left: 22px;\n" +
                    "    white-space: nowrap;\n" +
                    "    width: 100%;\n" +
                    "    overflow: hidden;\n" +
                    "    text-overflow: ellipsis;\n" +
                    "    word-wrap: normal;\n" +
                    "    z-index: 2;\n" +
                    "}\n" +
                    "\n" +
                    ".su-select-list-search {\n" +
                    "    position: relative;\n" +
                    "    list-style-type: none;\n" +
                    "    padding: 8px 6px 7px 0;\n" +
                    "    margin: 0 -11px 0 0;\n" +
                    "    overflow: hidden;\n" +
                    "    box-sizing: border-box;\n" +
                    "}\n" +
                    "\n" +
                    ".su-select-list-search-inner {\n" +
                    "    margin: 0 20px;\n" +
                    "    border-bottom: 1px solid #4c8bf7;\n" +
                    "}\n" +
                    "\n" +
                    ".su-integrations-settings {\n" +
                    "    margin: 0 auto 35px;\n" +
                    "    padding: 22px 23px 15px !important;\n" +
                    "    background-color: #fff !important;\n" +
                    "    width: calc(100% - 39px);\n" +
                    "    box-sizing: border-box;\n" +
                    "}\n" +
                    "\n" +
                    ".su-integrations-description {\n" +
                    "    margin-bottom: 12px;\n" +
                    "}\n" +
                    "\n" +
                    ".user-integrations {\n" +
                    "    margin-bottom: 35px;\n" +
                    "}\n" +
                    "\n" +
                    ".modal-large .modal-body {\n" +
                    "    width: 762px;\n" +
                    "}\n" +
                    "\n" +
                    ".add-input {\n" +
                    "    /*calc(100 % - 160 px);*/\n" +
                    "}\n" +
                    "\n" +
                    ".button-input_red:not(.button-input-disabled) {\n" +
                    "    border: 1px solid #e66969;\n" +
                    "    background: #f37575;\n" +
                    "    color: #fff;\n" +
                    "}\n" +
                    "\n" +
                    "b {\n" +
                    "    font-weight: bold !important;\n" +
                    "}\n" +
                    "\n" +
                    ".su-button {\n" +
                    "    line-height: 13px;\n" +
                    "    vertical-align: top;\n" +
                    "}\n" +
                    "\n" +
                    ".su-input + .button-input, .button-input + .su-input, .su-input + .su-input {\n" +
                    "    margin-left: 9px;\n" +
                    "}\n" +
                    "\n" +
                    ".mail-action__settings_footer .mail-action__remove-controls {\n" +
                    "    position: absolute;\n" +
                    "    top: -6px;\n" +
                    "    right: 0;\n" +
                    "}\n" +
                    "\n" +
                    ".su-mail-footer {\n" +
                    "    max-width: 60%;\n" +
                    "}\n" +
                    "\n" +
                    ".w-100 {\n" +
                    "    width: 100% !important;\n" +
                    "}\n" +
                    "\n" +
                    ".template-item__name.su-item {\n" +
                    "    max-width: 400px !important;\n" +
                    "}\n" +
                    "\n" +
                    ".text-danger {\n" +
                    "    color: #f37575;\n" +
                    "}\n" +
                    "\n" +
                    "\n" +
                    ".agreeinp {\n" +
                    "    margin: 10px 10px 2px 2px;\n" +
                    "}\n" +
                    "\n" +
                    ".oferta_title {\n" +
                    "\n" +
                    "}\n" +
                    "\n" +
                    ".cus_sel {\n" +
                    "    width: 278px;\n" +
                    "    padding: 6px;\n" +
                    "    margin: 4px 0;\n" +
                    "    border: 1px solid #dbdedf;\n" +
                    "    border-radius: 3px;\n" +
                    "    color: #313942;\n" +
                    "}\n" +
                    "\n" +
                    ".support {\n" +
                    "    width: 100%;\n" +
                    "    display: inline-block;\n" +
                    "    margin: 18px 0 0 0;\n" +
                    "}\n" +
                    "\n" +
                    ".s_instruction {\n" +
                    "    margin: 0 0 8px 0;\n" +
                    "}\n" +
                    "\n" +
                    ".s_left {\n" +
                    "    float: left;\n" +
                    "    width: 60%;\n" +
                    "}\n" +
                    "\n" +
                    ".s_title {\n" +
                    "    font: 13px Arial;\n" +
                    "    color: #848c90;\n" +
                    "}\n" +
                    "\n" +
                    ".s_icons {\n" +
                    "    height: 32px;\n" +
                    "    margin: 8px 0 0 0;\n" +
                    "    display: inline-block;\n" +
                    "}\n" +
                    "\n" +
                    ".s_icon {\n" +
                    "    float: left;\n" +
                    "}\n" +
                    "\n" +
                    ".s_icon a {\n" +
                    "    margin: 4px;\n" +
                    "}\n" +
                    "\n" +
                    ".s_icon img {\n" +
                    "    width: 24px;\n" +
                    "    height: 24px;\n" +
                    "    box-shadow: 0 1px 1px 1px rgba(154, 147, 140, 0.14);\n" +
                    "}\n" +
                    "\n" +
                    ".s_right {\n" +
                    "    float: left;\n" +
                    "    width: 40%;\n" +
                    "}\n" +
                    "\n" +
                    ".s_other {\n" +
                    "    font: 13px Arial;\n" +
                    "}\n" +
                    "\n" +
                    ".s_link {\n" +
                    "    font: bold 14px Arial;\n" +
                    "}\n" +
                    "\n" +
                    ".s_clear {\n" +
                    "    clear: both;\n" +
                    "}\n" +
                    "\n" +
                    ".s_line {\n" +
                    "    width: 100%;\n" +
                    "    height: 1px;\n" +
                    "    background: darkgray;\n" +
                    "    box-shadow: 0 1px 1px 1px rgba(154, 147, 140, 0.14);\n" +
                    "}\n</style>");

                if ($modal_body.find('input[name="oferta"]').val() == 1) //заполняем поле oferta, если чекбокс отмечен
                    $modal_body.find('input[name="oferta_check"]').prop('checked', true); //заполняем поле чекбокс, если оферта отмечена
                else
                    $modal_body.find('input[name="oferta_check"]').prop('checked', false);

                var $oferta_error = $('div.oferta_error'),
                    $save_btn = $('button.js-widget-save');

                $modal_body.find('input[name="oferta_check"]').on('change', function (e) {

                    var $checkbox = $(e.currentTarget);
                    if ($checkbox.prop('checked')) {
                        $modal_body.find('input[name="oferta"]').val('1'); //заполняем поле oferta, если чекбокс отмечен
                        $oferta_error.addClass('hidden'); // скрываем предупреждение, если оно отображено
                    } else {
                        $modal_body.find('input[name="oferta"]').val(''); // очищаем поле oferta, если не отмечен чекбокс
                    }
                });

                // для валидации телефона
                self.phoneValidate($modal_body);

                $save_btn.on('click', function () {
                    if ($(this).hasClass('button-input-disabled')) return;
                    if ($modal_body.find('input[name="oferta"]').val() == "") {
                        $oferta_error.removeClass('hidden');
                    } else {
                        let phone = $modal_body.find('input[name="phone"]').val();
                        let account_id = AMOCRM.constant('account').id;
                        self.$authorizedAjax({
                            url: 'https://integrations.salesup.pro/api/configure',
                            method: 'GET',
                            data: {
                                subdomain: self.get_subdomain(),
                                account_id: account_id,
                                client_uuid: self.settings.oauth_client_uuid,
                                current_user_id: AMOCRM.constant('user').id,
                                phone: phone
                            }
                        });
                    }
                });
                return true;
            },

            destroy: function () {
                return true;
            },


        };
        return this;
    };
});
