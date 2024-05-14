const dateTime = {
    dateFormat: '',
    timeFormat: '',
    __init: (dateFormat, timeFormat) => {
        dateTime.dateFormat = dateFormat;
        dateTime.timeFormat = timeFormat;
    },

    initDate: (inputDateTime) => {
        let dateTimes = inputDateTime.split(' ');
        let dateParts = dateTimes[0];
        let timeParts = dateTimes[1];

        let formatPartsDate = dateTime.dateFormat.split(/[\-.\/]/);
        dateParts = dateParts.split(/[\-.\/]/);

        let yearIndex = formatPartsDate.findIndex(part => part.toLowerCase().includes('y'));
        let monthIndex = formatPartsDate.findIndex(part => part.toLowerCase().includes('m'));
        let dayIndex = formatPartsDate.findIndex(part => part.toLowerCase().includes('d'));

        let year = parseInt(dateParts[yearIndex], 10);
        let month = parseInt(dateParts[monthIndex], 10) - 1;
        let day = parseInt(dateParts[dayIndex], 10);

        let date = new Date(year, month, day);

        if (typeof timeParts !== 'undefined') {
            timeParts = timeParts.split(':');
            let hour = parseInt(timeParts[0], 10);
            let minute = parseInt(timeParts[1], 10);
            let second = dateTime.timeFormat.includes('ss') ? parseInt(timeParts[2], 10) : 0;

            hour += dateTime.timeFormat.includes('A') && dateTime[2] === 'PM' ? 12 : 0;

            date.setHours(hour, minute, second);
        }

        return date;
    },
}

const listJs = {
    url: null,
    module: null,
    tableId: null,
    oTable: null,

    __init: (url, data) => {
        $(document).ready( () => {
            listJs.url = url;
            listJs.module = data.module;
            listJs.tableId = `#${data.module}_tbl`;
            listJs.initDataTable(data);
        });
    },

    initDataTable: async (data) => {
        let columns = [];
        let searchCols = [];
        let columnDefs = [
            {"targets": [], "orderable": false},
            {"targets": [], "visible": false}
        ];
        data.columns.forEach((column) => {
            if (column.display) {
                if (column.relation === false) {
                    columns.push({'data': column.field, title: column.label});
                } else {
                    columns.push({'data': column.relation.alias_name, title: column.label});
                }
                if (column.orderable === false) {
                    columnDefs[0].targets.push(column.index);
                }
                if (column.hidden === true) {
                    columnDefs[1].targets.push(column.index);
                }
                //init search value for column
                if (typeof data.filter[column.index] === 'string') {
                    searchCols.push({search: data.filter[column.index]});
                } else {
                    searchCols.push(null);
                }
            }
        });

        let oTable = $(listJs.tableId).DataTable({
            processing: true,
            serverSide: true,
            searching: true,
            sort: true,
            order: [[7, "desc"]],
            pageLength: 5,
            columnDefs: columnDefs,
            displayStart: 0,
            columns: columns,
            searchCols: searchCols,
            search: {
                search: typeof data.search === 'string' ? data.search : '',
            },
            lengthMenu: [3, 5, 10, 25, 50, 75, 100],
            dom: '<"dt-layout-row ui-helper-clearfix"<"dt-layout-cell dt-start"f><"dt-layout-cell dt-end"l>>t<"dt-layout-row ui-helper-clearfix"<"dt-layout-cell dt-start"i><"dt-layout-cell dt-end"p>>',
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                lengthMenu: "_MENU_",
                info: "Showing _START_ to _END_ of _TOTAL_ entries",
                infoEmpty: "Showing 0 to 0 of 0 entries"
                // infoFiltered:   "(filtered from _MAX_ total entries)",
                // paginate: {
                //     first:      "First",
                //     last:       "Last",
                //     next:       "Next",
                //     previous:   "Previous"
                // },
            },
            ajax: {
                url: `${listJs.url}${listJs.module}/ajax/getRecords`,
                method: 'POST',
                complete: function (response) {
                    let responseText = JSON.parse(response.responseText);
                    $(listJs.tableId).find(`#${data.module}_check_all`).prop('checked', responseText.checkedAll);
                    $(`#${data.module}_delete`).prop('disabled', !responseText.selected);
                    $(`#${data.module}_archive`).prop('disabled', !responseText.selected);
                }
            },
            initComplete: function () {
                //search by column
                oTable.columns().every(function () {
                    let column = this;
                    let title = column.footer().textContent;
                    let input = document.createElement('input');
                    if (title !== 'Action') {
                        input.value = typeof data.filter[column[0][0]] === 'string' ? data.filter[column[0][0]] : '';
                        input.placeholder = title;
                        column.footer().replaceChildren(input);

                        input.addEventListener('keyup', () => {
                            if (column.search() !== this.value) {
                                column.search(input.value).draw();
                            }
                        });
                    } else {
                        input.type = 'checkbox';
                        input.className = `${data.module}-checkbox-item`;
                        input.id = `${data.module}_check_all`;
                        input.value = `${data.module}_check_all`;

                        let div = document.createElement('div');
                        div.className = 'action-column';
                        div.append(input);
                        column.footer().replaceChildren(div);
                    }
                });

                //show hide column
                let countHiddenColumn = data.columns.filter(column => column.hidden === true && column.display).length;
                let select = $(`#${data.module}_select`);
                select.find('select').multiSelect({'noneText':'Column'});
                select.find('.multi-select-menuitems').find('.multi-select-menuitem input').on('change', function() {
                    let value = $(this).val();
                    if (value === 'select_all') {
                        let checkedStatus = $(this).prop('checked');
                        select.find('.multi-select-menuitems').find('.multi-select-menuitem input').toArray().forEach(function(element) {
                            let checkbox = $(element);
                            checkbox.prop('checked', checkedStatus);

                            let val = checkbox.val();
                            if (val !== 'select_all') {
                                val = JSON.parse(atob(val));
                                oTable.column(val.index).visible(checkbox.prop('checked'));
                            }
                        });
                    } else {
                        value = JSON.parse(atob($(this).val()));
                        oTable.column(value.index).visible($(this).prop('checked'));

                        if (countHiddenColumn === select.find('.multi-select-menuitems').find('.multi-select-menuitem input:checked').filter(function() {return $(this).val() !== 'select_all';}).length) {
                            select.find('.multi-select-menuitems').find('.multi-select-menuitem input[value="select_all"]').prop('checked', true);
                        } else {
                            select.find('.multi-select-menuitems').find('.multi-select-menuitem input[value="select_all"]').prop('checked', false);
                        }
                    }
                });

                //check all
                listJs.selectItem(oTable);

                //button delete
                $(`#${data.module}_delete`).on('click', function() {
                    listJs.deleteRecord($(this).data('value'));
                })
            }
        });
        // console.log(oTable.page.info().recordsTotal);
        listJs.oTable = oTable;
    },

    drawTable: () => {
        let currentPage = listJs.oTable.page();
        listJs.oTable.page(currentPage).draw('page');
    },

    selectItem: (oTable) => {
        $(listJs.tableId).on('change', `.${listJs.module}-checkbox-item`, async function () {
            if ($(this).val() === `${listJs.module}_check_all`) {
                $(listJs.tableId).find(`.${listJs.module}-checkbox-item`).prop('checked', $(this).prop('checked'));
            }

            await $.ajax({
                url: `${listJs.url}${listJs.module}/ajax/select/${$(this).val()}`,
                method: 'POST',
                dataType: "JSON",
                data: {
                  checked: $(this).prop('checked'),
                },
                success: function (response) {
                    $(`#${listJs.module}_delete`).prop('disabled', !response.selected);
                    $(`#${listJs.module}_archive`).prop('disabled', !response.selected);
                    $(`#${listJs.module}_check_all`).prop('checked', response.selected === oTable.page.info().recordsTotal);
                },
            });
        });
    },

    deleteRecord: (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                await $.ajax({
                    url: `${listJs.url}${listJs.module}/ajax/delete/${id}`,
                    method: 'DELETE',
                    dataType: "JSON",
                    success: function (response) {
                        if(response.status) {
                            Swal.fire({
                                title: "Deleted!",
                                text: "This record has been deleted.",
                                icon: "success"
                            });
                            listJs.drawTable();
                        } else {
                            Swal.fire({
                                title: "Deleted!",
                                text: "This record hasn't been deleted.",
                                icon: "error"
                            });
                        }
                    },
                })
            }
        });
    },

    archiveConversion: async () => {
        await $.ajax({
            url: `${listJs.url}${listJs.module}/ajax/archiveConversion`,
            method: 'POST',
            dataType: "JSON",
            success: function (response) {
                if(response.status) {
                    Swal.fire({
                        title: "Archived!",
                        text: "This record has been archived.",
                        icon: "success"
                    });
                    listJs.drawTable();
                } else {
                    Swal.fire({
                        title: "Archived!",
                        text: "This record hasn't been archived.",
                        icon: "error"
                    });
                }
            },
        })
    }
}

const formJs = {
    url: '',
    module: '',
    form: '',
    __init: (url, data) => {
        $(document).ready( () => {
            formJs.url = url;
            listJs.module = data.module;
            formJs.form = $('#form');
            // $('#closed_date').datepicker({dateFormat: 'dd/mm/yy'});
            $('#closed_date').mobiscroll().datepicker({
                controls: ['calendar', 'time'],
                touchUi: true,
                display: 'anchored',
                dateFormat: dateTime.dateFormat,
                timeFormat: dateTime.timeFormat,
            });
            formJs.validate(data.fields);
        });
    },

    validate: (fields) => {
        let patternRules = [];

        fields.forEach((field) => {
            if (field.validate) {
                field.validate.rules.forEach(rule => {
                    if (rule.rule === 'pattern') {
                        patternRules.push({ ruleName: field.field + '_pattern', rule: rule.rule, value: rule.value, message: rule.message });
                    }
                });
            }
        });

        $.validator.addMethod("greaterThanCurrentTime", function(value, element) {
            let currentTime = new Date();
            let inputTime = dateTime.initDate(value);
            return this.optional(element) || inputTime > currentTime;
        });

        patternRules.forEach(rule => {
            if (rule.rule === 'pattern') {
                $.validator.addMethod(rule.ruleName, function(value, element) {
                    return this.optional(element) || new RegExp(rule.value).test(value);
                }, rule.message);
            }
        });

        let rules = {};
        let messages = {};

        fields.forEach(field => {
            let fieldRules = {};
            let fieldMessages = {};

            if (field.validate) {
                field.validate.rules.forEach(rule => {
                    if (rule.rule === 'pattern') {
                        fieldRules[field.field + '_pattern'] = true;
                    } else if (rule.rule === 'remote') {
                        fieldRules[rule.rule] = {
                            url: `${formJs.url}${listJs.module}/ajax/checkExists`,
                            type: "POST",
                            data: {
                                field: field.field,
                                tables: rule.tables,
                            }
                        };
                        fieldMessages[rule.rule] = rule.message;
                    } else {
                        fieldRules[rule.rule] = rule.value;
                        fieldMessages[rule.rule] = rule.message;
                    }
                });
                rules[field.field] = fieldRules;
                messages[field.field] = fieldMessages;
            }
        });

        formJs.form.validate({
            rules: rules,
            messages: messages
        });
    },
}