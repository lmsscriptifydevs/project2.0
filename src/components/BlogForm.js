import { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";

const BlogForm = ({ initialData = null, onSubmit }) => {
  const navigate = useNavigate();

  const [title, setTitle] = useState(initialData?.title || "");
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [content, setContent] = useState(initialData?.content || "");
  const [status, setStatus] = useState(initialData?.status || "Draft");

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("status", status);

    if (coverImageFile) {
      formData.append("cover_image", coverImageFile.name);
    }

    onSubmit(formData);
  };

  return (
    <Card>
      <Card.Header>
        <h5>{initialData ? "✏️ Edit Blog" : "📝 Create New Blog"}</h5>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cover Image</Form.Label>
            {initialData?.cover_image_url && (
              <div className="mb-2">
                <img
                  src={initialData.cover_image_url}
                  alt="Current cover"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </div>
            )}
            <Form.Control
              type="file"
              onChange={(e) => setCoverImageFile(e.target.files[0])}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <ReactQuill
              value={content}
              onChange={setContent}
              theme="snow"
              style={{ height: "200px" }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </Form.Select>
          </Form.Group>

          <Button type="submit" variant="primary">
            {initialData ? "Update Blog" : "Create Blog"}
          </Button>
          <Button
            variant="secondary"
            className="ms-2"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default BlogForm;
