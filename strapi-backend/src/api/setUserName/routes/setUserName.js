module.exports = {
  routes: [
    {
     method: 'GET',
     path: '/setUserName',
     handler: 'setUserName.saveUserName',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
