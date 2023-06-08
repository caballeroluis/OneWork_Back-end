# OneWork
## _A Web App to streamline recruitment processes_

# About the Project

OneWork was a project made by [Alberto] and [Luis] and deployed in a homemade environment, in order to add precision and agility to their hiring process work and that of their friends and above all to practice. Nonprofit.

Version control was managed with Git, and project management was done with GitLab.

The homemade server was programmed to save power by automatically shutting down each night. This was achieved through a Ubuntu Server configuration and settings in the BIOS.

It's highly likely that the no-ip URLs for the pre-production and production environments are no longer related to this project or do not exist.

[Alberto]: <https://github.com/Elminsterio>
[Luis]: <https://github.com/caballeroluis>

## Features

With this tool, users will be able to:

- Create an account as a recruiter or worker.
- Post job Offers.
- View the Offers on a fully public Kanban board.

_Additionally, there was a plan to create a video call system using WebRTC for conducting interviews, but it was never implemented._


## Tech (Server software)

Developed with these technologies:

- [Node.js] - An open-source, cross-platform JavaScript runtime environment.
- [Express] - Fast, unopinionated, minimalist web framework for Node.js.
- [Socket.IO] - Bidirectional and low-latency communication for every platform.
- [MongoDB] - Open source, document-oriented, NoSQL database system.
- [Angular] - Web development framework.

[Node.js]: <https://nodejs.org>
[Express]: <https://expressjs.com>
[Socket.IO]: <https://socket.io>
[MongoDB]: <https://www.mongodb.com>
[Angular]: <https://angular.io>

Deployed on these technologies:

- [NGINX] - High performance lightweight web server and reverse proxy server.
- [Ubuntu] - Reliable Linux distribution for servers.
- [PM2] - Advanced, production process manager for Node.JS.

[NGINX]: <https://nginx.org>
[Ubuntu]: <https://ubuntu.com/download/server>
[PM2]: <https://pm2.keymetrics.io>

## Tech (Server ardware)

<div align="left">

| - Processor: AMD Ryzen 5 1600 Stepping AF 3.6GHz<br>- Storage: WD Green 3D SSD 120GB SATA3<br>- Memory (x2): Corsair Value Select DDR4 2133 PC4-17000 8GB CL15<br>- Motherboard: MSI A320M-A PRO<br>- Graphics: Zotac GeForce GT710 1GB GDDR3<br>- Case: Tacens Anima AC016 USB 3.0<br>- Extra fan: Tacens Aura II 80x80<br>- PSU: Corsair VS450 450W 80 Plus<br>- Tools: Crimper<br>- Tools: UTP CAT6 cable<br>- Tools: UTP Cat.6 RJ45 connector | <img height="250px" alt="Screenshot 2023-06-08 at 11 27 17" src="https://github.com/caballeroluis/OneWork_Front-end/assets/111797757/fcbaefe0-3a60-4960-857d-cc4398d87016"> |
| --- | --- |

</div>

# User interface demo

## Login

![Login](https://github.com/caballeroluis/OneWork_Front-end/blob/main/src/assets/images/demo-screenshots/1-Login.gif?raw=true)

## Edit an Offer

![Edit an Offer](https://github.com/caballeroluis/OneWork_Front-end/blob/main/src/assets/images/demo-screenshots/2-Edit-an-Offer.gif?raw=true)

## User Verification to modify the behavior and appearance of User Offers


![User verification](https://github.com/caballeroluis/OneWork_Front-end/blob/main/src/assets/images/demo-screenshots/3-Verifying-user-without-sockets-part.gif?raw=true)

## Drag and drop an Offer on the Kanban board

![Drag and drop](https://github.com/caballeroluis/OneWork_Front-end/blob/main/src/assets/images/demo-screenshots/4-Drag-and-drop-an-Offer.gif?raw=true)

## Displaying the JWT Token and State Management Tools created with RxJS

![jwt token](https://github.com/caballeroluis/OneWork_Front-end/blob/main/src/assets/images/demo-screenshots/5-Showing-jwt-in-a-custom-state-management.gif?raw=true)

## Showing the Let's Encrypt certificate that was used to secure browsing

![Let's Encrypt certificate](https://github.com/caballeroluis/OneWork_Front-end/blob/main/src/assets/images/demo-screenshots/6-Let's-Encrypt-certificate.gif?raw=true)

# Installation (Back-end)

## Dependencies

Run `npm install` for get dependencies.

## Development server

Run `npm start` for a dev server.

# Installation (Front-end)

For more help on the API of this project, see the [OneWork_Front-end repository](https://github.com/Elminsterio/OneWork_Front-end) which can be found at [Alberto's account](https://github.com/Elminsterio?tab=repositories)

or

For more help on the API of this project, see the [OneWork_Front-end repository](https://github.com/caballeroluis/OneWork_Front-end) which can be found at [Luis's account](https://github.com/caballeroluis?tab=repositories).

## License

MIT
