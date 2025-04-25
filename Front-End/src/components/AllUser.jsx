import { useEffect, useState } from "react";
import { summaryApi } from "../common";
import {
  Button,
  Modal,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Pagination, // Flowbite-React Pagination (if available)
} from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import Loder from "./Loder";
import { toast } from "react-toastify";

function AllUsers() {
  const navigate = useNavigate();
  const [user, setUser] = useState([]); // ইউজারের তালিকা
  const [showModal, setShowmodal] = useState(false);
  const [showEdit, setshowedit] = useState(false);
  const [loading, setloading] = useState(false);
  const [loading2, setloading2] = useState(false);
  const [useridForUpdate, setuseridforupdate] = useState("");
  const [useridForDelete, setuseridfordelete] = useState("");
  const [role, setRole] = useState(""); // নতুন role value
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // প্রতি পেজে দেখানো আইটেম সংখ্যা

  // মোট পেজ গণনা
  const totalPages = Math.ceil(user.length / itemsPerPage);

  // বর্তমান পেজের ইউজার তালিকা
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = user.slice(indexOfFirstItem, indexOfLastItem);

  // ইউজার তালিকা নিয়ে আসা
  async function getAllUser() {
    try {
      const response = await fetch(summaryApi.getalluser.url, {
        credentials: "include",
      });
      const data = await response.json();
      setUser(data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  useEffect(() => {
    getAllUser();
  }, []);

  // Delete user handler
  const handleDeleteUser = async () => {
    setloading(true);
    setShowmodal(false);
    try {
      const res = await fetch(
        `http://localhost:8080/api/user/delete/${useridForDelete}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to delete the user.");
      } else {
        setUser((prev) => prev.filter((usr) => usr._id !== useridForDelete));
        toast.success(data.message || "User deleted successfully!");
      }
    } catch (error) {
      console.error("Delete user error:", error);
      toast.error(error.message || "An error occurred.");
    } finally {
      setloading(false);
    }
  };

  // Role change handler (বৈশিষ্ট্য পরিবর্তনের জন্য)
  function onChangeRole(e) {
    setRole(e.target.value);
  }

  async function changeUserRole() {
    setloading2(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/updateuserrole/${useridForUpdate}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role }), // role অবজেক্ট পাঠানো
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "User role updated successfully!");
        setshowedit(false);
        await getAllUser();
      } else {
        toast.error(data.message || "Failed to update user role.");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred.");
    } finally {
      setloading2(false);
    }
  }

  return (
    <div className="overflow-x-auto m-5 mb-8 md:w-[70vw] md:mt-7">
      <Table hoverable>
        <TableHead>
          <TableHeadCell>SL</TableHeadCell>
          <TableHeadCell>Image</TableHeadCell>
          <TableHeadCell>UserName</TableHeadCell>
          <TableHeadCell>Role</TableHeadCell>
          <TableHeadCell>Update Date</TableHeadCell>
          <TableHeadCell>
            <span>Action</span>
          </TableHeadCell>
          <TableHeadCell>
            <span className="sr-only">Edit</span>
          </TableHeadCell>
        </TableHead>
        <TableBody className="divide-y">
          {currentUsers.map((item, i) => (
            <TableRow
              key={item._id}
              className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <TableCell>{indexOfFirstItem + i + 1}</TableCell>
              <TableCell>
                <img
                  className="w-10 h-8 rounded-full"
                  src={item.avatar}
                  alt={`${item.username}'s avatar`}
                />
              </TableCell>
              <TableCell>{item.username}</TableCell>
              <TableCell>{item.role}</TableCell>
              <TableCell>
                {new Date(item.updatedAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Link
                  onClick={() => {
                    setshowedit(true);
                    setuseridforupdate(item._id);
                  }}
                  className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                  Edit
                </Link>
              </TableCell>
              <TableCell>
                <Link
                  onClick={() => {
                    setuseridfordelete(item._id);
                    setShowmodal(true);
                  }}
                  className="font-medium text-red-400 hover:underline">
                  Delete
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Component */}
      <div className="mt-4 flex justify-center">
        <Pagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalPages={totalPages}
        />
      </div>

      {/* Delete Modal */}
      <Modal
        show={showModal}
        size="md"
        onClose={() => setShowmodal(false)}
        popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure">
                <div onClick={handleDeleteUser} className="flex gap-2">
                  {loading && (
                    <Spinner aria-label="Spinner button example" size="sm" />
                  )}
                  <p>{"Yes, I'm sure"}</p>
                </div>
              </Button>
              <Button color="gray" onClick={() => setShowmodal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Edit Role Modal */}
      <Modal show={showEdit} size="md" onClose={() => setshowedit(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <div className="flex gap-3 w-full justify-center items-center p-4">
              <label htmlFor="role">Role:</label>
              <select
                name="role"
                id="role"
                onChange={onChangeRole}
                defaultValue="">
                <option value="" disabled>
                  Select Role
                </option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
            </div>
            <div className="flex justify-center gap-4">
              <Button color="failure">
                <div onClick={changeUserRole} className="flex gap-2">
                  {loading2 && (
                    <Spinner aria-label="Spinner button example" size="sm" />
                  )}
                  <p>{"Yes, I'm sure"}</p>
                </div>
              </Button>
              <Button color="gray" onClick={() => setshowedit(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AllUsers;
