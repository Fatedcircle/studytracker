import { Routes, Route } from "react-router";
import MainLayout from "../components/layouts/MainLayout";
import MainPage from "../components/mainpage/MainPage.jsx";
import CourseDetail from "../components/CourseDetail.jsx";
import ProfilePage from "../pages/ProfilePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AddCoursePage from "../pages/AddCoursePage";
import AddProviderPage from "../pages/AddProviderPage";
import NotFound from "../pages/NotFound.jsx"

const AppRouter = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<MainPage />} />
                <Route path="/course/:id" element={<CourseDetail />} />
                <Route path="/new-course" element={<AddCoursePage />} />
                <Route path="/new-provider" element={<AddProviderPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
};

export default AppRouter;
