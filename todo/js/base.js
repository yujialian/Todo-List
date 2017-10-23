/**
 * Created by yujialian on 10/11/17.
 */
;(function () {
    'use strict';
    var $form_add_task = $('.add-task')
        , $task_delete
        , $task_detail
        , new_task = {}
        , $task_detail = $('.task-detail')
        , $task_detail_mask = $('.task-detail-mask')
        , task_list = []
        ;

    init();
    $form_add_task.on('submit', on_add_task_form_submit);
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
        console.log('$task_delete', $task_delete);
        $task_delete.on('click', function () {
            var $this = $(this);
            /*Find which event's delete button is been pushed*/
            var $item = $this.parent().parent();
            var index = $item.data('index');
            /*Select if want to delete the item */
            var tmp = confirm('You sure want to delete this item?');
            tmp ? delete_task(index) : null;
        })
    }

    function listen_task_detail() {
        //console.log('$task_detail', $task_detail)
        $task_detail.on('click', function () {
            var $this = $(this);
            var $item = $this.parent().parent();
            var index = $item.data('index');
            console.log('index', index);
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

    function init() {
        task_list = store.get('task_list') || [];
        if (task_list.length)
            render_task_list();
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
        $task_delete = $('.action.delete');
        $task_detail = $('.action.detail');
        listen_task_delete();
        listen_task_detail();
        //console.log('1', 1);
    }

    function listen_task_detail()
    {
        $task_detail.on('click',function() {
            var $this = $(this);
            $this.parent().parent();

        })
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
