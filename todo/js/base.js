/**
 * Created by yujialian on 10/11/17.
 */
;(function () {
    'use strict';
    var $form_add_task = $('.add-task')
        , $delete_task

        , new_task = {}
        , task_list = []
        ;

    init();
    $form_add_task.on('submit', function (e) {
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
            //render_task_list();
            $input.val(null)
        }
    })

    $delete_task.on('click', function ()
    {
        var $this = $(this);
        var $item = $this.parent().parent();
        var index = $item.data('index');
        var tmp = confirm('You sure want to delete this item?');
        tmp ? delete_task(index): null;

    })
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
            render_task_list()
    }

    function delete_task(index) {
        /*if no index or index does not exist, return directly*/
        if(!index || !task_list[index]) return;
        delete task_list[index];
        /*Refresh local storage*/
        refresh_task_list();
    }

    /*Refresh localstorage data and render view*/
    function refresh_task_list()
    {
        store.set('task_list', task_list);
        render_task_list()
    }

    function render_task_list() {
        var $task_list = $('.task-list');
        $task_list.html('');
        for (var i = 0; i < task_list.length; i++) {
            var $task = render_task_item(task_list[i], i)
            $task_list.append($task);
        }
        console.log('$delete_task', $delete_task)
        $delete_task = $('.action.delete')
    }


    function render_task_item(data, index) {
        var list_item_tpl =
            '<div class="task-item" data-index="' + index + '">' +
            '<span><input type="checkbox"></span>' +
            '<span class="task-content">' + data.content + '</span>' +
            '<span class="fr">' +
            '<span class="action delete"> Delete</span>' +
            '<span class="action delete"> Detail</span>' +
            '</span>' +
            '</div>';
        return $(list_item_tpl)
    }
})();
