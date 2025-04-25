import { Button, Label, Textarea, TextInput } from "flowbite-react";
import { useState } from "react";
import { summaryApi } from "../common";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const [formData, setFormData] = useState({
    url: "",
    title: "",
    author: "",
    price: "",
    desc: "",
    language: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Input change handler
  function onChange(e) {
    const { id, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [id]: value }));
  }

  // Form submit handler
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);

    // Validation check
    if (Object.values(formData).some((value) => value.trim() === "")) {
      toast.error("Please fill all the details");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(summaryApi.addbook.url, {
        method: summaryApi.addbook.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        navigate("/Dashboard?tab=allbooks");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-64 pt-10 flex justify-center items-center">
      <div className="bg-gray-200 dark:bg-zinc-700 rounded-md min-w-[450px] px-10 pb-8 mb-4">
        <form onSubmit={onSubmit}>
          {/* Image URL Input */}
          <div>
            <Label htmlFor="url" value="Image URL" className="m-2 block" />
            <TextInput id="url" type="text" placeholder="Image URL" value={formData.url} onChange={onChange} required />
          </div>

          {/* Image Preview */}
          {formData.url && (
            <div className="flex justify-center py-3">
              <img src={formData.url} alt="Book Preview" className="max-h-40 rounded-md shadow-lg" />
            </div>
          )}

          {/* Book Title */}
          <div>
            <Label htmlFor="title" value="Book Title" className="m-2 block" />
            <TextInput id="title" type="text" placeholder="Book Title" value={formData.title} onChange={onChange} required />
          </div>

          {/* Author */}
          <div>
            <Label htmlFor="author" value="Author" className="mb-2 block" />
            <TextInput id="author" type="text" placeholder="Author Name" value={formData.author} onChange={onChange} required />
          </div>

          {/* Price */}
          <div>
            <Label htmlFor="price" value="Price" className="mb-2 block" />
            <TextInput id="price" type="number" placeholder="Price" value={formData.price} onChange={onChange} required />
          </div>

          {/* Language */}
          <div>
            <Label htmlFor="language" value="Language" className="mb-2 block" />
            <TextInput id="language" type="text" placeholder="Language" value={formData.language} onChange={onChange} required />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="desc" value="Book Description" className="mb-2 block" />
            <Textarea id="desc" placeholder="Description" value={formData.desc} onChange={onChange} required rows={4} />
          </div>

          {/* Submit Button */}
          <div className="w-full mt-5 flex justify-center items-center">
            <Button type="submit" size="md" isProcessing={loading} gradientDuoTone="purpleToBlue">
              Post Book
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
