import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function AdminUploadLesson({ courseId }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");

  const uploadVideo = async () => {
    if (!file) return;

    const filePath = `${courseId}/${file.name}`;

    const { data, error } = await supabase.storage
      .from("course-videos")
      .upload(filePath, file);

    if (error) {
      console.log(error);
      return;
    }

    // Save lesson in database
    await supabase.from("lessons").insert({
      title: title,
      video_url: filePath,
      course_id: courseId,
      position: 1,
    });

    alert("Lesson uploaded successfully!");
  };

  return (
    <div>
      <h2>Upload Lesson</h2>

      <input
        type="text"
        placeholder="Lesson Title"
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={uploadVideo}>Upload Lesson</button>
    </div>
  );
}