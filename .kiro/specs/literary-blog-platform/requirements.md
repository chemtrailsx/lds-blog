# Requirements Document

## Introduction

The Literary and Debating Society is a full-stack blog platform with a dark academia literary aesthetic. It allows users to create, edit, and delete blog posts with rich content including cover images and inline images. The homepage organizes posts by category with filtering support. A cinematic intro animation plays on first load. Real-time notifications alert all connected users when a new post is published. An admin role provides moderation capabilities over all posts. The backend uses MongoDB for persistence.

## Glossary

- **Platform**: The full-stack Literary and Debating Society web application
- **User**: An authenticated individual with an account on the Platform
- **Admin**: A User with elevated privileges to manage any post on the Platform
- **Post**: A blog entry consisting of a title, author name, category, cover image, and rich body content
- **Category**: A predefined classification label assigned to a Post (e.g., Literature, Debate, Philosophy, Poetry, Essays)
- **Cover_Image**: The primary image displayed at the top of a Post and in post listing cards
- **Inline_Image**: An image embedded within the body content of a Post
- **Notification**: A real-time message broadcast to all connected Users when a new Post is published
- **Intro_Animation**: The full-screen animated sequence displaying "Literary and Debating Society" on first platform load
- **Feed**: The homepage view displaying all Posts organized and filterable by Category
- **Editor**: The authenticated User who created a given Post
- **Auth_Service**: The component responsible for user registration, login, and session management
- **Post_Service**: The component responsible for creating, reading, updating, and deleting Posts
- **Notification_Service**: The component responsible for broadcasting real-time Notifications
- **Image_Service**: The component responsible for handling Cover_Image and Inline_Image uploads and storage

---

## Requirements

### Requirement 1: Intro Animation

**User Story:** As a visitor, I want to see an animated intro when I first open the site, so that the platform's identity is established with a memorable first impression.

#### Acceptance Criteria

1. WHEN a visitor loads the Platform for the first time in a browser session, THE Platform SHALL display the Intro_Animation full-screen before showing the Feed.
2. WHEN the Intro_Animation begins, THE Platform SHALL animate the text "Literary and Debating Society" by zooming it into the screen from a small scale to full size.
3. WHILE the Intro_Animation is playing, THE Platform SHALL prevent interaction with the Feed.
4. WHEN the Intro_Animation has been displayed for 2 seconds, THE Platform SHALL transition to the Feed using a fade-out effect.
5. WHEN a visitor has already seen the Intro_Animation in the current browser session, THE Platform SHALL skip the Intro_Animation and display the Feed directly.

---

### Requirement 2: User Authentication

**User Story:** As a visitor, I want to register and log in to the platform, so that I can create and manage my own blog posts.

#### Acceptance Criteria

1. THE Auth_Service SHALL allow a visitor to register with a unique username, email address, and password.
2. WHEN a visitor submits a registration form with an email address already associated with an existing account, THE Auth_Service SHALL return an error message indicating the email is already in use.
3. WHEN a visitor submits valid credentials, THE Auth_Service SHALL issue a session token and redirect the User to the Feed.
4. WHEN a User's session token expires or is invalid, THE Auth_Service SHALL redirect the User to the login page.
5. IF a visitor submits a login form with incorrect credentials, THEN THE Auth_Service SHALL return an error message and SHALL NOT issue a session token.
6. THE Auth_Service SHALL store passwords using a one-way cryptographic hash and SHALL NOT store plaintext passwords.

---

### Requirement 3: Post Creation

**User Story:** As a User, I want to create a blog post with a title, author name, category, cover image, and rich body content, so that I can share my writing with the community.

#### Acceptance Criteria

1. WHEN an authenticated User submits a new Post form, THE Post_Service SHALL persist the Post to the database with the provided title, author name, category, cover image URL, and body content.
2. THE Post_Service SHALL require a title, author name, category, and body content before persisting a new Post.
3. WHEN a User selects a Cover_Image file during Post creation, THE Image_Service SHALL upload the file and return a URL that THE Post_Service SHALL associate with the Post.
4. WHEN a User inserts an Inline_Image into the Post body, THE Image_Service SHALL upload the file and embed the returned URL into the body content.
5. THE Post_Service SHALL associate the newly created Post with the authenticated User's account as the Editor.
6. WHEN a Post is successfully created, THE Notification_Service SHALL broadcast a Notification to all connected Users.

---

### Requirement 4: Category Classification

**User Story:** As a User, I want to assign a category to my post from a predefined list, so that readers can find posts relevant to their interests.

#### Acceptance Criteria

1. THE Platform SHALL provide a fixed dropdown list of categories for Post classification, including at minimum: Literature, Debate, Philosophy, Poetry, and Essays.
2. WHEN a User creates or edits a Post, THE Post_Service SHALL require exactly one category to be selected from the dropdown before the Post can be saved.
3. THE Post_Service SHALL store the selected category as a field on the Post document in the database.

---

### Requirement 5: Post Editing

**User Story:** As a User, I want to edit my own blog posts, so that I can correct mistakes or update content after publishing.

#### Acceptance Criteria

1. WHEN an authenticated User requests to edit a Post, THE Post_Service SHALL verify that the requesting User is the Editor of that Post before allowing edits.
2. IF an authenticated User attempts to edit a Post that the User did not create, THEN THE Post_Service SHALL return a 403 Forbidden error.
3. WHEN an authenticated User submits valid edits to a Post the User owns, THE Post_Service SHALL update the Post in the database and return the updated Post.
4. WHEN a User replaces the Cover_Image during editing, THE Image_Service SHALL upload the new file and THE Post_Service SHALL update the Cover_Image URL on the Post.

---

### Requirement 6: Post Deletion

**User Story:** As a User, I want to delete my own blog posts, so that I can remove content I no longer want published.

#### Acceptance Criteria

1. WHEN an authenticated User requests to delete a Post, THE Post_Service SHALL verify that the requesting User is the Editor of that Post before deleting.
2. IF an authenticated User attempts to delete a Post that the User did not create, THEN THE Post_Service SHALL return a 403 Forbidden error.
3. WHEN an authenticated User confirms deletion of a Post the User owns, THE Post_Service SHALL remove the Post from the database and remove the Post from the Feed.

---

### Requirement 7: Homepage Feed

**User Story:** As a visitor, I want to see all published blog posts organized by category on the homepage, so that I can browse content that interests me.

#### Acceptance Criteria

1. THE Feed SHALL display all published Posts grouped by Category.
2. WHEN the Feed loads, THE Platform SHALL retrieve all Posts from the database and render them as cards showing the Post title, author name, category, and Cover_Image.
3. WHEN a visitor clicks on a Post card, THE Platform SHALL navigate to the full Post detail page displaying the complete body content and all Inline_Images.
4. WHILE no Posts exist in a given Category, THE Feed SHALL display a placeholder message for that Category indicating no posts are available.

---

### Requirement 8: Category Filtering

**User Story:** As a visitor, I want to filter blog posts by category on the homepage, so that I can focus on the type of content I want to read.

#### Acceptance Criteria

1. THE Feed SHALL display a set of filter controls corresponding to each available Category plus an "All" option.
2. WHEN a visitor selects a Category filter, THE Feed SHALL display only Posts belonging to the selected Category.
3. WHEN a visitor selects the "All" filter, THE Feed SHALL display Posts from all Categories.
4. WHEN a visitor selects a Category filter that has no published Posts, THE Feed SHALL display a message indicating no posts are available for that Category.

---

### Requirement 9: Real-Time Notifications

**User Story:** As a User, I want to receive a real-time notification when a new blog post is published, so that I am immediately aware of new content.

#### Acceptance Criteria

1. WHEN a new Post is successfully created and persisted, THE Notification_Service SHALL broadcast a Notification to all currently connected Users within 2 seconds of the Post being saved.
2. THE Notification_Service SHALL include the new Post's title, author name, and category in the Notification payload.
3. WHEN a connected User receives a Notification, THE Platform SHALL display the Notification as a non-blocking toast message visible for at least 4 seconds.
4. WHEN a User is not connected at the time a Post is published, THE Platform SHALL NOT queue or deliver the missed Notification upon reconnection.

---

### Requirement 10: Admin Moderation

**User Story:** As an Admin, I want to edit or delete any user's blog post, so that I can moderate content and maintain community standards.

#### Acceptance Criteria

1. THE Auth_Service SHALL support an Admin role that is assigned to designated User accounts.
2. WHEN an Admin requests to edit any Post, THE Post_Service SHALL allow the edit regardless of which User created the Post.
3. WHEN an Admin requests to delete any Post, THE Post_Service SHALL delete the Post regardless of which User created the Post.
4. WHEN a non-Admin User attempts to access Admin moderation actions, THE Post_Service SHALL return a 403 Forbidden error.
5. THE Platform SHALL display edit and delete controls on all Posts when the authenticated User has the Admin role.

---

### Requirement 11: Dark Academia UI Aesthetic

**User Story:** As a visitor, I want the platform to have a dark academia literary visual style, so that the design reinforces the intellectual and literary identity of the community.

#### Acceptance Criteria

1. THE Platform SHALL use a color palette consisting of dark tones including deep browns, muted greens, aged parchment off-whites, and near-black backgrounds.
2. THE Platform SHALL use serif typefaces for headings and post body content to reinforce the literary aesthetic.
3. THE Platform SHALL use sans-serif or small-caps typefaces for navigation and UI controls to maintain readability.
4. THE Platform SHALL apply consistent dark academia visual motifs such as aged textures, subtle paper or ink-inspired decorative elements across all pages.
5. THE Platform SHALL maintain a responsive layout that preserves the dark academia aesthetic across desktop, tablet, and mobile viewport sizes.
