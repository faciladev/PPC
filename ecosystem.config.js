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
	  exec_mode : "cluster",
	  instances : 0,
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
      exec_mode : "cluster",
	  instances	: 0,
      env : {
        NODE_ENV: "production",
        PORT: "9000"
      }
    },

    //Cron Job for PPC_DEV
    {
      name      : "PPC_CRON_DEV",
      script    : "./cron/cron.js",
      env : {
        NODE_ENV: "dev_remote",
        PORT: "3002"
      },
      env_local : {
        NODE_ENV: "development",
        PORT: "3003"
      }
    },

    //Cron Job for PPC_PROD
    {
      name      : "PPC_CRON_PROD",
      script    : "./cron/cron.js",
      env : {
        NODE_ENV: "production",
        PORT: "3001"
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
