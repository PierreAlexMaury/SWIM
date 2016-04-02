README:

This is the git repository of the SWIM project of the Canard Fringant group.

This project is composed of 6 repositories. Supervisor, Producer, Consumer, ESB, MessageBroker and resources.

- How to work with it :

1. Clone the project in your local machine using with the command:
   git clone https://YOUR-LOGIN@www.etud.insa-toulouse.fr/stash/scm/swima/swim15cf.git

2. Here is the list of the branches you need to use:
    - master:     the main branch, where there is the released code, fully tested (integration test included)
    - dev:        the development branch where the components have been autonomously tested in their respective branches
                  but have not been tested all together (no global integration test)
    - Consumer:   the branch where the consumer is in development
    - Producer:   the branch where the producer is in development
    - Supervisor: the branch where the supervisor is in development
    - ESB:        the branch where the ESB is in development

    If you are working on a user story concerning the consumer you should enter the command:
    git checkout Consumer

    You can check it by entering the command 'git branch'. You will see all the branches and the branch Consumer with a
    * before its name.

3. Then you should retrieve the last version of all the components from the dev branch by entering the command:
   git pull origin dev

4. You now are up to date with all the work that has been realized on the other components. While you work on the
   on the consumer, push your modifications on the Consumer branch thanks to the following command:
   git push origin Consumer

5. Once you are done with your user story and all the unit/integration test of the consumer have been successfully
   passed you can push your work into the dev branch, using the command:
   git push origin dev

6. Don't forget the last but important task, integration test. Enter the command 'git checkout dev' to get back to the
   dev branch. Make the integration test of the consumer with all the other components, track down regressions and
   exchange with the others to resolve conflicts and integration bugs.

- About the commit messages :

  We need to harmonize our commit messages. We can use the following pattern:
  "[user-story-code]-('components-affected-separated-with-',') description-of-the-realized-modifications"

  For example, if I worked on the user story SWIMA-33 where the job was to branch the supervisor with the mongoDB
  database, the message of the commit should be:
  "[SWIMA-33]-(MongoDB,Supervisor) The supervisor can know write scenarios into the database"

- What you should NOT do :

  You should NEVER edit the code of a component when you are working on the branch of an other. For example, you should
  never modify the code of the producer while working on the branch Consumer. We will avoid many conflict resolve if we
  respect that.

  However, you might need to be working on several components at the time. For example, you might be working on the
  communication between the supervisor and the consumer via the message broker. You will then need to edit the code of
  both supervisor and consumer. If so you should create a new branch of your own that you will name with the user story
  code. The command to create a new branch and immediately use it is 'git checkout -b name-of-the-user-story', for
  example, 'git checkout -b SWIMA-33'.

  In this new branch, you should first push the content of the dev branch to get the latest version. You push the
  modifications you realize in the newly create branch and once you are done with it, push back the code in the dev
  branch. Don't forget to remove your temporary branch with the command 'git branch -d name-of-the-branch'.

- How to make it work:

  You should be using a Unix based OS to develop. Ideally, Ubuntu 14.04. You should use the technologies with the
  following versions.

  Technologies versions:
  - Node.js : 4.2.2
  - Sails.js: 0.11.3
  - ExtJS:    5.1.1
  - npm:      2.14.7
  - Express:  4.13.3

1. The supervisor/GUI:
  The GUI is developed with ExtJS version 5.1.1 and is located into the supervisor. If you have a look at the Supervisor
  folder, there is a folder assets, containing a folder ExtJS. This is the folder of the GUI. There is no need of Sencha
  Cmd or any other Sencha software (Sencha is the company which owns the ExtJS product) to build or run the GUI. Just
  edit the code directly.

  The supervisor itself is directly located into the Supervisor folder. It is developed with Sails.js v0.11.3, based on
  Node.js v4.2.2. You will need to have these two frameworks installed on you computer to build and deploy the servers.
  Sails is useful to create in one click a server with REST API, routes management, database management (MySQL,
  PostgreSQL or MongoDB), gui, all of this powered with an efficient MVC pattern.

  For the supervisor, you won't need to directly use Node.js commands, Sails will do it for you. When you are located in
  the Supervisor folder, enter the command "sails lift" to build and deploy the server. The server will be launched at
  the 8000 port. Open your browser and navigate to the address http://localhost:8000. You will be redirected to the
  http://localhost:8000/ExtJS/GUI address and will see the GUI displayed. To stop the sails server, just hit CTRL+C in
  the console.

2. The consumer:
  The consumer is located in the folder Consumer. It is only based on Express, itself based on node. To launch the
  consumer server, go to the Consumer folder and launch the command "node consumer.js" and that's it. The consumer is
  programmed to be connected to the 8001 port. It consumes the SOAP web service created by the producer. The consumer is
  able to do so thanks to the the plugin node-soap (see section 3).

  Since the consumer needs to communicate with the supervisor via REST, the Express framework is used to rapidly create
  a REST API on the consumer. It is much more basic than sails, perfect for the needs of our consumer.

3. The producer:
   The producer works in a very similar way than the consumer. Go to the Producer folder and launch the command
   "node producer.js". The producer server is now running and listening on the 8002 port. The producer is also composed
   of a wsdl file called producer.wsdl. This file describes how to use the SOAP web service offered by the producer. The
   SOAP web service is powered by node-soap plugin, created for node and provided by the package manager npm v2.14.7.
   You will need it to install any plugin for node (and therefore for sails). For instance, to add the plugin node-soap
   to the producer, the command "npm install node-soap", while located in the Provider folder, has been used. Since it
   is now already included in the folder, you should not need execute this special command.

- Documentations:

  - ExtJS:     https://docs.sencha.com/extjs/5.1/5.1.1-apidocs/
  - Sails.js:  http://sailsjs.org/documentation/concepts/
  - Node.js:   https://nodejs.org/api/
  - npm.js:    https://docs.npmjs.com
  - node-soap: https://www.npmjs.com/package/soap
  - Express    http://expressjs.com/4x/api.html