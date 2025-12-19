# How to Push Your Split-Stack App to GitHub

Since we split your project into `backend` and `frontend`, you need **Two Repositories**.

## 1. Backend Repository
1.  Go to [GitHub.com/new](https://github.com/new) and create a repository named **`fashfolio-backend`**.
2.  Open your terminal and run:
    ```bash
    cd "d:\EXAMS\AGENTIC AI\MAJORS\fashfolio-app\backend"
    git remote add origin https://github.com/YOUR_USERNAME/fashfolio-backend.git
    git branch -M main
    git push -u origin main
    ```

## 2. Frontend Repository
1.  Go to [GitHub.com/new](https://github.com/new) and create a repository named **`fashfolio-frontend`**.
2.  Open your terminal and run:
    ```bash
    cd "d:\EXAMS\AGENTIC AI\MAJORS\fashfolio-app\frontend"
    git remote add origin https://github.com/YOUR_USERNAME/fashfolio-frontend.git
    git branch -M main
    git push -u origin main
    ```

## 3. Deploy
- **Render**: Connect the `fashfolio-backend` repo.
- **Vercel**: Connect the `fashfolio-frontend` repo.
