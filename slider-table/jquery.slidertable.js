/**
 * Created by WU-HOME on 2017-09-04.
 */
;(function ($) {

    function loadData(el, data, config) {
        var html = [];
        var sumFlex = 0;
        var elHeight = $(el).height();
        var rowHeight = elHeight / (config.showHead ? (config.rows + 1) : config.rows);
        html.push('<div id="' + config.id + '" class="table" style="height:' + elHeight + 'px">');
        html.push('<div class="thead" style="display:' + (config.showHead ? 'block' : 'none') + ';">');

        $.each(config.columns, function (index, column) {
            sumFlex += (column.flex ? column.flex : 1);
        });

        html.push('<div class="tr" style="height: ' + rowHeight + 'px">');
        $.each(config.columns, function (index, column) {
            column.width = ((column.flex ? column.flex : 1) * 100 / sumFlex) + '%';
            html.push('<div class="th" style="width:' + column.width + '">' + (column.text == null ? "" : column.text) + '</div>');
        });
        html.push('</div>');
        html.push('</div>');// thead end

        html.push('<div class="tbody">');
        var point = 0;
        for (var i = 0; i < config.rows; i++) {
            var cls = i % 2 ? 'odd' : 'eve';
            html.push(config.rowRender(el, config.columns, data[i], rowHeight, cls));
            point = i;
        }
        html.push('</div>');//tbody end
        html.push('</div>'); //table end
        el.append(html.join(''));
        el.find('.tbody .tr:first').css({
            'margin-top': -rowHeight + 'px'
        });
        el.find('.tbody').css({
            'padding-top': rowHeight + 'px'
        });
        if (config.interval) {
            var interval = setInterval(function () {
                point = point + 1;
                if (point >= data.length) {
                    point = 0;
                }
                var clsName=el.find('.tbody .tr:last').hasClass('odd')?'eve':'odd';
                var tr = config.rowRender(el, config.columns, data[point], rowHeight, clsName);
                el.find('.tbody .tr:first').animate({marginTop: rowHeight * -2}, config.speed, "swing", function () {
                    this.remove();
                    el.find('.tbody .tr:first').css({
                        'margin-top': -rowHeight + 'px'
                    });
                });
                el.find('.tbody').append(tr);
            }, config.interval);
            el.attr('data-interval-id', interval);
        }
    }

    var methods = {
        init: function (options) {
            return this.each(function () {
                var $this = $(this);
                var config = $this.data('slidertable');

                if (typeof( config) == 'undefined') {

                    var defaults = {
                        id: 'st' + (Math.random() * 1000).toFixed(0),//指定table id，可以据此ID写CSS
                        rows: 5, //行数
                        showHead: true,
                        interval: 3000,//轮播间隔，ms
                        speed: 1000,//动画速度,ms
                        data: [{id: 1, name: '中国'}, {id: 2, name: '中国'}, {id: 3, name: '中国'}, {id: 4, name: '中国'}, {
                            id: 5,
                            name: '中国'
                        }, {id: 6, name: '中国'}, {id: 7, name: '中国'}, {id: 8, name: '中国'}, {id: 9, name: '中国'}, {
                            id: 10,
                            name: '中国'
                        }, {id: 11, name: '中国'}], /*取数地址{String}，或 callback函数{Function},或静态数据{Array}*/
                        columns: [{dataIndex: 'id', text: '序号', flex: 1}, {dataIndex: 'name', text: '国家', flex: 2}],//列配置
                        rowRender: function (el, columns, data, rowHeight, cls) {
                            cls = cls || "";
                            var html = ['<div class="tr ' + cls + '" style="height: ' + rowHeight + 'px">'];
                            for (var j = 0; j < columns.length; j++) {
                                if (columns[j].columnRender) {
                                    html.push(columns[j].columnRender(el, columns[j], data));
                                } else {
                                    html.push(this.columnRender(el, columns[j], data));
                                }
                            }
                            html.push('</div>');
                            return html.join('');
                        },

                        columnRender: function (el, column, data) {
                            return '<div class="td text-' + (column.align ? column.align : 'center') + '" style="width:' + column.width + '">' + (data[column.dataIndex] == null ? "" : data[column.dataIndex]) + '</div>';
                        }
                    };
                    if (options) {
                        $.extend(config, options);
                    }

                    config = $.extend({}, defaults, options);

                    $this.data('slidertable', config);
                } else {
                    config = $.extend({}, config, options);
                }

                var el = $(this);
                if ($.isArray(config.data)) {
                    loadData(el, config.data, config);
                } else if (typeof config.data == 'function') {
                    var data = config.data.call(window, el);
                    loadData(el, data, config);
                } else if (typeof config.data == 'string') {
                    $.post(config.data, {
                        rnd: new Date().getTime()
                    }, function (data, status) {
                        loadData(el, data, config);
                    }, 'json');
                }


                // 代码在这里运行

            });
        },
        destroy: function (options) {
            return $(this).each(function () {
                var $this = $(this);
                clearInterval($this.attr('data-interval-id'));
                $this.removeData('slidertable');
            });
        }
    };

    $.fn.slidertable = function () {
        var method = arguments[0];

        if (methods[method]) {
            method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (typeof(method) == 'object' || !method) {
            method = methods.init;
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.slidertable');
            return this;
        }

        return method.apply(this, arguments);

    }

})(jQuery);