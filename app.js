  var todomvc = angular.module('todomvc', ['firebase']);

  todomvc.controller('TodoCtrl', function TodoCtrl($scope, $firebaseArray) {

    var fireRef = new Firebase('https://coderwall-todo.firebaseio.com/');
    $scope.todos = $firebaseArray(fireRef);
    $scope.newTodo = '';
    $scope.editedTodo = null;

    $scope.$watch('todos', function(){
      var total = 0;

      $scope.todos.forEach(function(todo){
        total++;
      });

      // pass this $scope.totalCount to HTML - if it's > 0 (true), show the todos
      // else, hide the todos
      $scope.totalCount = total;
    }, true);

    $scope.addTodo = function(){
        // trim() is to remove empty space characters from the input field
        // example:
        // "        Hello World         "    ====>    "Hello World"
        var newTodo = $scope.newTodo.trim();

        if (newTodo.length == 0) {
          // do nothing if newTodo is empty string
            return;
        }

        // push to firebase
        $scope.todos.$add({
            title: newTodo,
            completed: false
        });

        // clear the input
        $scope.newTodo = '';
    };

    // remove single todo
    $scope.removeTodo = function(todo){
        $scope.todos.$remove(todo);
    };

    $scope.editTodo = function(todo){
      // get active todo data to be edited
      $scope.editedTodo = todo;
    };

    // update todo for changes we made
    $scope.doneEditing = function(todo){
      $scope.editedTodo = null;
      var title = todo.title.trim();
      if (title) {
        $scope.todos.$save(todo);
      } else {
        $scope.removeTodo(todo);
      }
    };

    // delete all todos that have been completed
    $scope.clearCompletedTodos = function(){

      angular.forEach($scope.todos, function(todo){
        if (todo.completed){
          $scope.todos.$remove(todo);
        }
      });

    };

    // toggle completion status for all todos
    // if markAll checkbox is checked = true
    $scope.markAll = function(allCompleted){
      console.log(allCompleted)

      angular.forEach($scope.todos, function(todo){
        todo.completed = allCompleted

        /*
        in other words, if the checkbox is checked (true),
        todo.completed = true

        if the the checkbox is unchecked (false),
        todo.completed = false

        allCompleted is dynamic here based on user's toggle event
        */

        console.log(todo)

        // save to firebase
        $scope.todos.$save(todo);

      });

    };

});
