module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // Dev App
    {
      name      : "PPC_DEV",
      script    : "./bin/www",
      watch     : true,
      env: {
        NODE_ENV: "dev_remote",
        PORT: "8000"
      },
      env_local : {
        COMMON_VARIABLE: "true",
        NODE_ENV: "development",
        PORT: "8081"
      }
    },
    //Production App
    {
      name      : "PPC_PROD",
      script    : "./bin/www",
      watch     : true,
      instances : 0,
      exec_mode : "cluster",
      env : {
        NODE_ENV: "production",
        PORT: "9000"
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : "node",
      host : "212.83.163.1",
      ref  : "origin/master",
      repo : "git@github.com:repo.git",
      path : "/var/www/production",
      "post-deploy" : "npm install && pm2 startOrRestart ecosystem.json --env production"
    },
    dev : {
      user : "node",
      host : "212.83.163.1",
      ref  : "origin/master",
      repo : "git@github.com:repo.git",
      path : "/var/www/development",
      "post-deploy" : "npm install && pm2 startOrRestart ecosystem.json --env dev",
      env  : {
        NODE_ENV: "dev"
      }
    }
  }
}
