import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import authService from "../../appwrite/auth";
import appService from "../../appwrite/service";
import slugify from "slugify";
import RTE from "../RTE"

export default function PostForm({ existing = null }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState(existing?.title || "");
  const [content, setContent] = useState(existing?.content || "");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const { control, getValues } = useForm({
    defaultValues: {
      content: existing?.content || "",
    },
  });

  useEffect(() => {
    if (existing) setFile(null);
  }, [existing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const contentValue = getValues("content");
    console.log("RTE HTML:", contentValue);
    console.log("Before upload, file:", file);
    
    try {
      const user = await authService.getCurrentUser();
      const userid = user.$id;
      const slug =
        existing?.$id || slugify(title, { lower: true, strict: true });
      const featuredImage = file
        ? await appService.uploadFile(file)
        : existing?.featuredImage || null;

      console.log("After upload, featuredImage ID:", featuredImage);

      if (existing) {
       await appService.updatePost(existing.$id, {
         title,
         content: contentValue,
         featuredImage
       });
     } else {
       await appService.createPost({
         title,
         content: contentValue,
         featuredImage,
         slug,
         userid
       });
     }
      navigate("/all-posts");
    } catch (err) {
      console.error("Error saving post", err);
      alert("Failed to save post");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your post title"
              required
            />
          </div>

          <div className="h-full">
            <div className="h-96 border rounded-lg overflow-hidden">
              <RTE
                label="Content :"
                name="content"
                control={control}
                defaultValue={getValues("content")}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between h-full space-y-6">
          <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
            {file ? (
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : existing?.imageUrl ? (
              <img
                src={existing.imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image selected
              </div>
            )}
          </div>

          <div className="w-full">
            <label className="block text-gray-700 font-medium mb-1">
              {existing ? "Replace Image" : "Featured Image"}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0] || null)}
              className="w-full text-sm"
              {...(!existing && { required: true })}
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className={`w-full py-3 rounded-lg text-white text-lg font-medium transition ${
              busy
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {busy
              ? existing
                ? "Updating…"
                : "Posting…"
              : existing
              ? "Update Post"
              : "Create Post"}
          </button>
        </div>
      </div>
    </form>
  );
}
