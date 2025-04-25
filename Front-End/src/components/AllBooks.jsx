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
} from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import Loder from "./Loder";
import { toast } from "react-toastify";

function AllBooks() {
  const navigate = useNavigate();
  const [book, setbook] = useState();
  const [showModal, setShowmodal] = useState(false);
  const [loading, setloading] = useState(false);
  const [postidfordelete, setpostidfordelete] = useState("");
  const [postload, setpostLoad] = useState(false);
  console.log(postidfordelete);
  async function getAllBook() {
    setpostLoad(true);
    try {
      const response = await fetch(summaryApi.getallbook.url, {
        credentials: "include",
      });

      // চেক করা যে response সফল কিনা
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // data.data থাকলে সেট করা, না থাকলে খালি অ্যারে
      setbook(data.data || []);
    } catch (error) {
      console.error("Failed to fetch books:", error);
      // প্রয়োজনে ইউজারকে এভাবে মেসেজ দেখাতে পারেন:
      // toast.error("Failed to fetch books. Please try again later.");
    } finally {
      // নিশ্চিত করা যে লোডিং স্টেট সবসময় false হবে
      setpostLoad(false);
    }
  }

  useEffect(() => {
    getAllBook();
  }, []);
  const handleDeletePost = async () => {
    setloading(true);
    setShowmodal(false);
    try {
      const res = await fetch(
        `http://localhost:8080/api/book/deletepost/${postidfordelete}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        // যদি DELETE রিকোয়েস্ট সফল না হয়, ইউজারকে এরর দেখানো হবে
        toast.error(data.message || "Failed to delete the book.");
      } else {
        // সফল হলে, স্টেট থেকে ডিলিট করা পোস্ট রিমুভ করা হবে
        setbook((prev) => prev.filter((post) => post._id !== postidfordelete));
        toast.success(data.message || "Book deleted successfully!");
      }
    } catch (error) {
      console.error("Delete post error:", error);
      toast.error(error.message || "An error occurred.");
    } finally {
      // নিশ্চিত করা যে লোডিং স্টেট সবসময় false হবে
      setloading(false);
    }
  };

  if (postload) {
    return <Loder />;
  }

  return (
    <div className="overflow-x-auto m-5 mb-8 md:w-[70vw] md:mt-7">
      <Table hoverable>
        <TableHead>
          <TableRow>
            <TableHeadCell>SL</TableHeadCell>
            <TableHeadCell>Image</TableHeadCell>
            <TableHeadCell>Title</TableHeadCell>
            <TableHeadCell>Author</TableHeadCell>
            <TableHeadCell>Update Date</TableHeadCell>
            <TableHeadCell>Action</TableHeadCell>
            <TableHeadCell className="sr-only">Edit</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {book?.map((item, i) => (
            <TableRow
              key={item._id}
              className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <TableCell>{i + 1}</TableCell>
              <TableCell>
                <img
                  onClick={() => navigate(`/book/${item._id}`)}
                  className="w-10 h-10 cursor-pointer"
                  src={item.url}
                  alt={item.title}
                />
              </TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.author}</TableCell>
              <TableCell>
                {new Date(item.updatedAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Link
                  to={`/Updatepost/${item._id}`}
                  className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                  Edit
                </Link>
              </TableCell>
              <TableCell>
                <button
                  onClick={() => {
                    setpostidfordelete(item._id);
                    setShowmodal(true);
                  }}
                  className="font-medium text-red-400 hover:underline">
                  Delete
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
              Are you sure you want to delete this book?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
                <div className="flex gap-2">
                  {loading && (
                    <Spinner aria-label="Spinner button example" size="sm" />
                  )}
                  <p>Yes, I'm sure</p>
                </div>
              </Button>
              <Button color="gray" onClick={() => setShowmodal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AllBooks;
