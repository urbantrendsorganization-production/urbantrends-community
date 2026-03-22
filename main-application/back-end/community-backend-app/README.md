# Community Backend

This is a community backend project designed to manage group dynamics, memberships, and invitation systems. This README serves as a guide for developers to understand the architecture and API integration.

## Main Features
* **Group Management**: Create and manage community groups.
* **Membership Logic**: Role-based access (Member vs. Moderator) with promotion/demotion workflows.
* **Invite System**: Secure joining via invite codes with moderator-controlled deactivation.

## Tech Stack
* **Framework**: Django / Django REST Framework (DRF)
* **Database**: PostgreSQL (Running via Docker on port 5435)
* **Environment**: Containerized workflow with Docker Compose

## API Endpoints

### Groups
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET/POST` | `/api/groups/` | List all groups or create a new group. |
| `GET/PUT/DELETE` | `/api/groups/{id}/` | Retrieve, update, or delete a specific group. |
| `POST` | `/api/groups/{id}/join/` | Join a group using an invite code. |
| `POST` | `/api/groups/{id}/leave/` | Leave a group. |

### Members (Moderator Only)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET/POST` | `/api/members/` | View or manage group members. |
| `POST` | `/api/members/{id}/promote/` | Promote a member to Moderator. |
| `POST` | `/api/members/{id}/demote/` | Demote a Moderator back to Member. |
| `DELETE` | `/api/members/{id}/remove/` | Remove a member from the group. |

### Invites (Moderator Only)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET/POST` | `/api/invites/` | List or create group invitation codes. |
| `POST` | `/api/invites/{id}/deactivate/` | Revoke/deactivate an active invite code. |

## ⚙️ Development Setup

1. **Database**: Ensure your Docker container is running:
   ```bash
   docker start urbantrends-community