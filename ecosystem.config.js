module.exports = {
  apps: [
    {
      name: 'bidding',
      script: 'pm2 start bin/www',

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      args: 'one two',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ],

  deploy: {
    production: {
      user: 'root',
      host: '173.248.240.193',
      ref: 'origin/master',
      repo: 'https://github.com/donaldding/bidding_market.git',
      path: '/var/www/bidding/production',
      'post-deploy':
        'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
}
