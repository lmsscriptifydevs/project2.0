import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import BlogForm from "../../../components/BlogForm";
import { createBlog } from "../../../redux/slices/blogSlice";
import SidebarLayout from "../sidebarLayout";

const CreateBlogPage = () => {

  const dispatch = useDispatch(); // ✅ Hook at top level
  const navigate = useNavigate();
  const handleCreate = async (formData) => {
    // Debug log
    for (let [key, value] of formData.entries()) {
      // console.log(`${key}:`, value);
    }

    try {
      const resultAction = await dispatch(createBlog(formData));
      const payload = unwrapResult(resultAction);

      // On success, navigate or show message
      // console.log("Blog created:", payload);
      navigate("/admin/blogs");
    } catch (err) {
      console.error("Failed to create blog:", err);
      // Show toast / error notification if needed
    }
  };
  
  return (
    <SidebarLayout>
      <BlogForm onSubmit={handleCreate} />
    </SidebarLayout>
  );
};

export default CreateBlogPage;
