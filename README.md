

---

# 🚀 **BuddyScript – Social Media Platform (Full Stack)**

A modern, feature-rich social platform built using **Next.js**, **Tailwind**, **MongoDB**, **Firebase**, and **Cloudinary** for media handling.
Optimized for performance, scalability, and clean code — perfect for real-world social application requirements.

---

## 🌟 **Features Included**

### 🔐 **Authentication**

* Authentication handle via firebase
* Secure JWT session handling
* Protected API Routes & Protected Pages
* Automatic user creation on first login


### 📝 **Posts**

* Create post (text + image)
* Image upload via  **Cloudinary**
* Live feed with pagination
* Post like/unlike functionality
* Comment system
* *(Optional)* Comment reply system

### ❤️ **Likes**

* Optimistic UI updates
* Prevent double-like
* Stores unique user+post relation
* Realtime count update

### 💬 **Comments**

* Add comments instantly
* Load previous comments
* Pagination + “View more comments”
* Comment UI with avatar, name, timestamp
* Like + Reply button included

### 📖 **Stories Component**

* Responsive Instagram-style stories
* Add story (Your Story)
* Other stories with top-right avatars
* Last card includes blue arrow for next

### 🧾 **Registration Page**

* Fully responsive
* Mobile-first UX
* Smooth layout with background shapes
* Clean UI with Google login integration

### 🎨 **UI & UX**

* TailwindCSS
* Reusable components
* Skeleton loaders
* Toast notifications
* Shadow, rounded, animations
* Responsive for all devices

---

# 🛠️ **Tech Stack**

### **Frontend**

* Next.js 14 (App Router)
* React
* Tailwind CSS
* Lucide Icons
* Axios

### **Backend**

* Next.js API Routes
* MongoDB 
* Firebase (Google Provider)
* JWT-based secure sessions

### **Media Handling**

*  Cloudinary

### **Other Tools**

* bcrypt / bcryptjs
* react hot toast
* React Hook Form


"dependencies": {
    "axios": "^1.13.2",
    "cloudinary": "^2.8.0",
    "css": "^3.0.0",
    "firebase": "^12.6.0",
    "firebase-admin": "^13.6.0",
    "lucide-react": "^0.554.0",
    "mongodb": "^6.21.0",
    "next": "16.0.3",
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "react-hot-toast": "^2.6.0",
    "tailwind": "^4.0.0"
  },

---

# 📁 **Folder Structure Overview**

```
/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── posts/
│   │   ├── comments/
│   │   └── likes/
│   ├── register/
│   ├── login/
│   └── dashboard/
│
├── components/
│   ├── SocialLogin.jsx
│   ├── RegisterForm.jsx
│   ├── StorySection.jsx
│   ├── PostCard.jsx
│   ├── CommentSection.jsx
│   └── Navbar.jsx
│
├── lib/
│   ├── dbConnect.js
│   └── auth.js
│
├── databaseCollection/
│   ├── User
│   ├── Post
│   ├── Comment
│   └── Like
│
├── public/assets/
│   ├── images/...
│
├── .env.local
└── README.md
```

---

# 🔧 **Installation Guide (Very Important for Job Reviewers)**

### **1️⃣ Clone the repository**

```bash
git clone https://github.com/mehediakash01/Social-App
cd Social-App
```

---

# ⚙️ **2️⃣ Install dependencies**

```bash
npm install
```

or

```bash
yarn install
```

---

# 🔐 **3️⃣ Setup Environment Variables (Required)**

Yes — **you MUST add `.env.local`**.
Without these, auth, DB, and image upload will NOT work.

Create a file:

```
.env.local
```

Add the following:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Google Auth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# CLOUDINARY
CLOUDINARY_API_KEY=your_CLOUDINARY_api_key
```

### 🔹 How to generate NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

---

# ▶️ **4️⃣ Run the development server**

```bash
npm run dev
```

Then open:

👉 [http://localhost:3000](http://localhost:3000)

---

# 💡 **5️⃣ (Optional) Build for Production**

```bash
npm run build
npm start
```

---

# 🧪 **Testing**

Manual testing includes:

* Login via Google
* Post creation
* Commenting
* Liking posts
* Reloading page to check persisted comments
* Image upload tests
* Mobile responsiveness tests

For job submissions, mention:

✔ "All features have been manually tested on mobile, tablet, and desktop."

---

# 🛡️ **Security Measures Implemented**

* JWT-based session protection
* API routes secured with middleware
* Passwords hashed using bcrypt (if email login enabled)
* Rate-limit optional


---


---


* Fully responsive
* Scalable architecture
* Clean code structure
* Easy for teams to extend
* Modern UI/UX following industry standards

---

# 🧑‍💻 **Author**

**Akash — MERN Stack Developer**
Passionate about building real-world apps with clean UI and scalable architecture.

---


