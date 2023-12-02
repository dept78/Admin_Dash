import React, { useEffect, useState } from "react";
import "./UsersList.css";
import "antd/dist/antd.css";
import ReactPaginate from "react-paginate";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { Pagination } from "antd";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const itemPerPage = 10;
  const pageVisited = pageCount * itemPerPage;

  const totalPages = Math.ceil(users.length / itemPerPage);
  const pageChange = ({ selected }) => {
    setPageCount(selected);
  };

  useEffect(() => {
    getUsersDetails();
  }, []);

  const getUsersDetails = () => {
    fetch(
      `https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json`
    )
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  };

  const deleteUser = (selectedUser) => {
    const userAfterDeletion = users.filter((user) => user.id !== selectedUser);
    setUsers(userAfterDeletion);
    
    setSelectedRows((prev) => prev.filter((row) => row !== selectedUser));
  };

  const editUserDetails = () => {
    
  };

  const toggleSelectAll = () => {
    
    if (selectedRows.length === users.slice(pageVisited, pageVisited + itemPerPage).length) {
      setSelectedRows([]);
    } else {
      const newSelectedRows = users
        .slice(pageVisited, pageVisited + itemPerPage)
        .map((user) => user.id);
      setSelectedRows(newSelectedRows);
    }
  };

  return (
    <div className="container">
      <div className="search-bar">
        <input
          type="text"
          name="name"
          placeholder="Search by any field"
          onChange={(e) => setSearchUser(e.target.value)}
        />
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" onChange={toggleSelectAll} checked={selectedRows.length === users.slice(pageVisited, pageVisited + itemPerPage).length} />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter((user) => {
              if (searchUser === "") return user;
              return (
                user.name.includes(searchUser) ||
                user.email.includes(searchUser) ||
                user.role.includes(searchUser)
              );
            })
            .slice(pageVisited, pageVisited + itemPerPage)
            .map((user) => (
              <tr key={user.id} className={selectedRows.includes(user.id) ? "selected" : ""}>
                <td>
                  <input
                    type="checkbox"
                    onChange={() => {
                      setSelectedRows((prev) =>
                        prev.includes(user.id)
                          ? prev.filter((row) => row !== user.id)
                          : [...prev, user.id]
                      );
                    }}
                    checked={selectedRows.includes(user.id)}
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td className="action-buttons">
                  <button onClick={editUserDetails}>
                    <AiFillEdit />
                  </button>
                  <button onClick={() => deleteUser(user.id)}>
                    <AiFillDelete />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination-container">
        <ReactPaginate
          previousLabel={"Prev"}
          nextLabel={"Next"}
          pageCount={totalPages}
          onPageChange={pageChange}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
}

export default UsersList;


