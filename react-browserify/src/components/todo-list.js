var React = require('react');
var Task = require('./task');
var TaskInput = require('./task-input');
var LocalStorage = require('../localstorage-service');

var TodoList = React.createClass({
  getInitialState: function () {
    return{
      todos: this.loadTasks(),
      inputValue: ''
    };
  },

  loadTasks : function () {

    if(!LocalStorage.get('todos')) {
      return [
        {value : 'Learn JavaScript', done: false },
        {value : 'Buy Milk', done: true },
        {value : 'Learn React', done: false }
      ];
    }

    return LocalStorage.get('todos');
  },

  updateStorage: function (todos) {
    LocalStorage.set('todos', todos);
  },

  addTask : function (e) {
    e.preventDefault();

    if(!this.state.inputValue) return;

    var todos = this.state.todos;

    todos.push({
      value: this.state.inputValue,
      done: false
    });

    this.updateStorage(todos);

    this.setState({
      todos: todos,
      inputValue: ''
    })
  },

  markTaskDone: function (index) {
    var todos = this.state.todos;
    var task = todos[index];

    todos.splice(index,1);
    task.done = !task.done;

    task.done ? todos.push(task) : todos.unshift(task);

    this.updateStorage(todos);

    this.setState({
      todos: todos
    });
  },

  removeTask: function (index) {
    this.state.todos.splice(index, 1);

    this.updateStorage(this.state.todos);

    this.setState({
      todos: this.state.todos
    });
  },

  triggerChange: function (e) {
    this.setState({
      inputValue: e.target.value
    });
  },

  render: function() {
    var todos = this.state.todos.map(function (task, index) {
      return(
        <Task
        key={index}
        value={task.value}
        done={task.done}
        markTaskDone={this.markTaskDone.bind(this, index)}
        removeTask={this.removeTask.bind(this, index)}
      /> )
    }.bind(this));

    return (
      <div className="col-xs-6 col-xs-offset-3 todo-list">
        <h1 className="title">My Awesome TodoList</h1>
        {todos}
        <TaskInput
        inputValue={this.state.inputValue}
        addTask={this.addTask}
        triggerChange={this.triggerChange}
        />
      </div>
    );
  }

});

module.exports = TodoList;
