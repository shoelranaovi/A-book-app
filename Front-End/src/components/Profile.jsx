import { Button, Label, Modal, Spinner, TextInput } from "flowbite-react";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { summaryApi } from "../common";
import { useNavigate } from "react-router-dom";
import { SigninSuccess } from "../redux/userSlice";

function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [edit, setEdit] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    password: "",
  });

  // Sync formData with currentUser on mount or user update
  useEffect(() => {
    setFormData({
      username: currentUser?.username || "",
      email: currentUser?.email || "",
      password: "",
    });
  }, [currentUser]);

  // Handle form input change
  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  // Update user profile
  async function updateUser() {
    setLoading(true);
    try {
      const response = await fetch(summaryApi.updateuser.url, {
        method: summaryApi.updateuser.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.success) {
        dispatch(SigninSuccess(data.data));
        toast.success(data.message || "Profile updated successfully!");
        navigate("/");
      } else {
        toast.error(data.message || "Failed to update profile.");
      }
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
      setOpenModal(false);
    }
  }

  return (
    <div className="flex flex-1 justify-center items-center min-w-[400px] md:w-[900px] m-6 rounded-xl">
      <form className="flex w-full md:w-[500px] flex-col gap-4">
        <div className="w-full flex justify-center items-center rounded-full">
          <img
            className="w-28 h-28 rounded-full"
            src={currentUser?.avatar}
            alt="User Avatar"
          />
        </div>

        <div className="w-full flex justify-end">
          <Button onClick={() => setEdit(!edit)}>
            {edit ? "Cancel" : "Edit"}
          </Button>
        </div>

        <div>
          <Label htmlFor="email" value="Your email" className="mb-2" />
          <TextInput
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!edit}
          />
        </div>
        <div>
          <Label htmlFor="username" value="User Name" className="mb-2" />
          <TextInput
            id="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            disabled={!edit}
          />
        </div>
        <div>
          <Label htmlFor="password" value="Your password" className="mb-2" />
          <TextInput
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter new password"
            disabled={!edit}
          />
        </div>

        {edit && (
          <Button
            onClick={(e) => {
              e.preventDefault();
              setOpenModal(true);
            }}
            type="submit">
            Submit
          </Button>
        )}
      </form>

      {/* Confirmation Modal */}
      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to update your profile?
            </h3>
            <div className="flex justify-center gap-4">
              <Button onClick={updateUser} color="failure">
                {loading ? (
                  <Spinner aria-label="Loading..." size="sm" />
                ) : (
                  "Yes, Update"
                )}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Profile;
