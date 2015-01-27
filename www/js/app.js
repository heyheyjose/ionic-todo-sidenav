// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('todo', ['ionic'])

/*
the Projects factory belowe handles saving and loading projects from
local storage, and also lets us save and load the last active
project index
*/

.factory('Projects', function() {
  return {
    all: function() {
      var projectString = window.localStorage['projects'];
      if (projectString) {
        return angular.fromJson(projectString);
      }
      return [];
    },
    save: function(projects) {
      window.localStorage['projects'] = angular.toJson(projects);
    },
    newProject: function(projectTitle) {
      // add a new project
      return {
        title: projectTitle,
        tasks: []
      };
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveProject']) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveProject'] = index;
    }
  }
})

.controller('TodoCtrl', function($scope, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate) {

  // a utility function for creating a new project with the given projectTitle
  var createProject = function(projectTitle) {
    var newProject = Projects.newProject(projectTitle);
    $scope.projects.push(newProject);
    Projects.save($scope.projects);
    $scope.selectProject(newProject, $scope.projects.length - 1);
  }
  
  // test data was in this array
  //$scope.tasks = [];

  // load or initialize projects
  $scope.projects = Projects.all();

  // grab the last active or the first project
  $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

  // called to create a new project
  $scope.newProject = function() {
    var projectTitle = prompt('Project name');
    if (projectTitle) {
      createProject(projectTitle);
    }
  };

  // called to select the given project
  $scope.selectProject = function(project, index) {
    $scope.activeProject = project;
    Projects.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };

  // create and load modal
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope
    // animation: 'slide-in-up'
  });

  // called when form is submitted
  $scope.createTask = function(task) {
    if (!$scope.activeProject || !task) {
      return;
    }
    $scope.activeProject.tasks.push({
      title: task.title
    });
    $scope.taskModal.hide();

    // inefficient, but... save all projects
    Projects.save($scope.projects);

    task.title = '';
  };

  // open the new task modal
  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  // close the new task modal
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };

  // toggling between projects
  $scope.toggleProjects = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  /*
  try to create the first project, make sure to defer this by
  using $timeout so everything is initialized properly
  */
  $timeout(function() {
    if ($scope.projects.length == 0) {
      while(true) {
        var projectTitle = prompt('Your first project title:');
        if (projectTitle) {
          createProject(projectTitle);
          break;
        }
      }
    }
  });
});
