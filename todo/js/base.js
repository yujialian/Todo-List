/**
 * Created by yujialian on 10/11/17.
 */
;(function () {
    'use strict';
    var $form_add_task = $('.add-task')
        , $task_delete_trigger
        , $task_detail
        , $task_detail_trigger
        , new_task = {}
        , $task_detail = $('.task-detail')
        , $task_detail_mask = $('.task-detail-mask')
        , task_list = []
        , current_index
        , $update_form
        , $task_detail_content
        ,$task_detail_content_input
        ;


    init();

    function init() {
        task_list = store.get('task_list') || [];
        if (task_list.length)
            render_task_list();
        //console.log('store.get(task_list)', store.get('task_list'));
    }

    $form_add_task.on('submit', on_add_task_form_submit)
    $task_detail_mask.on('click', hide_task_detail)

    function on_add_task_form_submit(e) {
        var new_task = {}, $input;
        /*Deactive default task*/
        e.preventDefault();
        /*Get new task value*/
        $input = $(this).find('input[name=content]');
        new_task.content = $input.val();

        /*If new task's value is NULL, return, otherwise continue.*/
        if (!new_task.content) return;
        /* Add new task. */
        if (add_task(new_task)) {
            render_task_list();
            $input.val(null)
        }
    }

    /*Looking and listening all the delete button events.*/
    function listen_task_delete()
    {
        //console.log('$task_delete', $task_delete);
        $task_delete_trigger.on('click', function () {
            var $this = $(this);
            /*Find which event's delete button is been pushed*/
            var $item = $this.parent().parent();
            var index = $item.data('index');
            /*Select if want to delete the item */
            var tmp = confirm('You sure want to delete this item?');
            tmp ? delete_task(index) : null;
        })
    }

    /*Delete one task*/
    function delete_task(index) {
        /*if no index or index does not exist, return directly*/
        if (index === undefined || !task_list[index]) return;
        delete task_list[index];
        /*Refresh local storage*/
        refresh_task_list();
    }

    function add_task(new_task) {
        /*Push the new task into task list*/
        task_list.push(new_task);
        /*Update local sotorage*/
        refresh_task_list();
        return true;
    }



    /*Refresh local storage data and render view*/
    function refresh_task_list() {
        store.set('task_list', task_list);
        render_task_list()
    }

    /*Render all the task templates */
    function render_task_list() {
        var $task_list = $('.task-list');
        $task_list.html('');
        for (var i = 0; i < task_list.length; i++) {
            var $task = render_task_item(task_list[i], i);
            $task_list.append($task);
        }
        $task_delete_trigger = $('.action.delete');
        $task_detail_trigger = $('.action.detail');
        listen_task_delete();
        listen_task_detail();
    }

    function listen_task_detail()
    {
        $task_detail_trigger.on('click',function() {
            var $this = $(this);
            var $item = $this.parent().parent();
            var index = $item.data('index');
            show_task_detail(index)
        })
    }

    /*check task detail.*/
    function show_task_detail(index) {
        render_task_detail(index);
        current_index = index;
        $task_detail.show();
        $task_detail_mask.show();

    }

    function update_task(index, data) {
        if(!index || !task_list[index])
            return;
        task_list[index] = /*$.merge({},task_list[index], */data;
        refresh_task_list();
    }

    /*render specific task's detail information.*/
    function render_task_detail(index) {
        if (index == undefined || !task_list[index])
            return;
        var item = task_list[index];
        var tpl =
        '<form>'+
        '<div class="content">'+
        item.content+
        '</div>'+
        '<div>' +
        '<input style="display: none;" type="text" name="content" value="' +item.content+ '">' +
        '</div>'+
        '<div>'+
        '<div class="desc">'+
        '<textarea name="desc">'+item.desc+'</textarea>'+
        '</div>'+
        '</div>'+
        '<div class="remind">'+
        '<input name="remind_date" type="date" value="'+ item.remind_date+ '">'+
        '</div>'+
            '<div><button type="submit">Submit</button></div>'+
        '</form>'

        $task_detail.html(null);
        $task_detail.html(tpl);
        $update_form = $task_detail.find('form');
        //console.log('$update_form', $update_form)
        $task_detail_content = $update_form.find('.content');
        $task_detail_content_input = $update_form.find('[name=content]');
        $task_detail_content.on('dblclick', function(){
            $task_detail_content_input.show();
            $task_detail_content.hide();
        })

        $update_form.on('submit', function(e)
        {
            e.preventDefault()
            var data = {};
            data.content = $(this).find('[name=content]').val();
            data.desc = $(this).find('[name=desc]').val();
            data.remind_date = $(this).find('[name=remind_date]').val();
            //console.log('data', data)
            update_task(index, data);
            hide_task_detail();
        })

    }

    function hide_task_detail() {
        $task_detail.hide();
        $task_detail_mask.hide();

    }

    /*Render single task templates.*/
    function render_task_item(data, index) {
        if (!data || !index) return;
        var list_item_tpl =
            '<div class="task-item" data-index="' + index + '">' +
            '<span><input type="checkbox"></span>' +
            '<span class="task-content">' + data.content + '</span>' +
            '<span class="fr">' +
            '<span class="action delete"> Delete</span>' +
            '<span class="action detail"> Detail</span>' +
            '</span>' +
            '</div>';
        return $(list_item_tpl)
    }
})();
