import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/AdminDashboard.css";

function AdminDashboard() {

    const navigate = useNavigate();

   const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalExams: 0,
    activeUsers: 0,
    pendingUsers: 0
});

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    /*
    =====================================================
    CHECK ADMIN
    =====================================================
    */

    useEffect(() => {

        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            navigate("/");
            return;
        }

        try {

            const user = JSON.parse(storedUser);

            if (user.role !== "admin") {
                navigate("/");
                return;
            }

            loadDashboard();

        } catch (error) {

            console.error("USER DATA ERROR:", error);

            localStorage.clear();
            navigate("/");
        }

    }, []);


    /*
    =====================================================
    LOAD DASHBOARD
    =====================================================
    */

    const loadDashboard = async () => {

        try {

            setRefreshing(true);

            const [statsResponse, usersResponse] =
                await Promise.all([
                    api.get("/admin/stats"),
                    api.get("/admin/users")
                ]);

            setStats(
                statsResponse.data.stats || {
                    totalUsers: 0,
                    totalStudents: 0,
                    totalTeachers: 0,
                    totalExams: 0,
                    activeUsers: 0
                }
            );

            setUsers(usersResponse.data.users || []);

        } catch (error) {

            console.error(
                "ADMIN DASHBOARD ERROR:",
                error.response?.data || error.message
            );

            if (error.response?.status === 401 ||
                error.response?.status === 403) {

                alert("Admin authorization failed. Please login again.");

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                navigate("/");
            }

        } finally {

            setLoading(false);
            setRefreshing(false);
        }
    };


    /*
    =====================================================
    CHANGE USER STATUS
    =====================================================
    */


    const approveUser = async (userId) => {

    try {

        const response =
            await api.patch(
                `/admin/users/${userId}/approve`
            );

        setUsers((previousUsers) =>
            previousUsers.map((user) =>
                user._id === userId
                    ? {
                        ...user,
                        isActive: true,
                        isVerified: true
                    }
                    : user
            )
        );

        setStats((previousStats) => ({
            ...previousStats,
            activeUsers:
                previousStats.activeUsers + 1,
            pendingUsers:
                Math.max(
                    0,
                    previousStats.pendingUsers - 1
                )
        }));

        alert(
            response.data.message ||
            "User approved successfully"
        );

    } catch (error) {

        console.error(
            "APPROVE USER ERROR:",
            error.response?.data ||
            error.message
        );

        alert(
            error.response?.data?.message ||
            "Failed to approve user"
        );

    }
};



    const toggleUserStatus = async (userId) => {

        try {

            const response = await api.patch(
                `/admin/users/${userId}/status`
            );

            setUsers((previousUsers) =>
                previousUsers.map((user) =>
                    user._id === userId
                        ? {
                            ...user,
                            isActive: response.data.user.isActive
                        }
                        : user
                )
            );

        } catch (error) {

            console.error(
                "USER STATUS ERROR:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to update user status"
            );
        }
    };


    /*
    =====================================================
    LOGOUT
    =====================================================
    */

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
    };


    /*
    =====================================================
    FILTER USERS
    =====================================================
    */

    const filteredUsers = users.filter((user) => {

        const matchesSearch =
            user.name?.toLowerCase().includes(
                search.toLowerCase()
            ) ||
            user.email?.toLowerCase().includes(
                search.toLowerCase()
            );

        const matchesRole =
            roleFilter === "all" ||
            user.role === roleFilter;

        return matchesSearch && matchesRole;
    });


    /*
    =====================================================
    LOADING
    =====================================================
    */

    if (loading) {

        return (
            <div className="admin-loading">
                <div className="admin-spinner"></div>
                <p>Loading Admin Dashboard...</p>
            </div>
        );
    }


    /*
    =====================================================
    DASHBOARD
    =====================================================
    */

    return (

        <div className="admin-dashboard">

            {/* =========================================
                TOP NAVBAR
            ========================================= */}

            <header className="admin-navbar">

                <div className="admin-brand">

                    <div className="admin-logo">
                        AE
                    </div>

                    <div>
                        <h2>AI Exam Portal</h2>
                        <span>Administration</span>
                    </div>

                </div>


                <div className="admin-nav-right">

                    <div className="admin-profile">

                        <div className="profile-avatar">
                            A
                        </div>

                        <div className="profile-info">
                            <strong>Administrator</strong>
                            <span>Admin</span>
                        </div>

                    </div>

                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            {/* =========================================
                MAIN CONTENT
            ========================================= */}

            <main className="admin-main">

                {/* HEADER */}

                <section className="admin-header">

                    <div>

                        <span className="admin-label">
                            ADMIN PANEL
                        </span>

                        <h1>Dashboard Overview</h1>

                        <p>
                            Monitor users, teachers, students and exams
                            from one place.
                        </p>

                    </div>


                    <button
                        className="refresh-btn"
                        onClick={loadDashboard}
                        disabled={refreshing}
                    >
                        {refreshing ? "Refreshing..." : "↻ Refresh"}
                    </button>

                </section>


                {/* =====================================
                    STAT CARDS
                ===================================== */}

                <section className="stats-grid">



                    <div className="admin-stat-card">

    <div className="stat-icon pending-icon">
        ⏳
    </div>

    <div>

        <span>Pending Approval</span>

        <h2>
            {stats.pendingUsers}
        </h2>

        <small>
            Awaiting admin approval
        </small>

    </div>

</div>

                    <div className="admin-stat-card">

                        <div className="stat-icon users-icon">
                            👥
                        </div>

                        <div>

                            <span>Total Users</span>

                            <h2>
                                {stats.totalUsers}
                            </h2>

                            <small>
                                Registered accounts
                            </small>

                        </div>

                    </div>


                    <div className="admin-stat-card">

                        <div className="stat-icon student-icon">
                            🎓
                        </div>

                        <div>

                            <span>Students</span>

                            <h2>
                                {stats.totalStudents}
                            </h2>

                            <small>
                                Student accounts
                            </small>

                        </div>

                    </div>


                    <div className="admin-stat-card">

                        <div className="stat-icon teacher-icon">
                            👨‍🏫
                        </div>

                        <div>

                            <span>Teachers</span>

                            <h2>
                                {stats.totalTeachers}
                            </h2>

                            <small>
                                Teaching accounts
                            </small>

                        </div>

                    </div>


                    <div className="admin-stat-card">

                        <div className="stat-icon exam-icon">
                            📝
                        </div>

                        <div>

                            <span>Total Exams</span>

                            <h2>
                                {stats.totalExams}
                            </h2>

                            <small>
                                Created exams
                            </small>

                        </div>

                    </div>

                </section>


                {/* =====================================
                    USER MANAGEMENT
                ===================================== */}

                <section className="users-section">

                    <div className="section-header">

                        <div>

                            <span className="admin-label">
                                USER MANAGEMENT
                            </span>

                            <h2>Registered Users</h2>

                            <p>
                                View and manage student and teacher accounts.
                            </p>

                        </div>

                        <div className="active-count">

                            <span className="active-dot"></span>

                            {stats.activeUsers} Active Users

                        </div>

                    </div>


                    {/* FILTER BAR */}

                    <div className="filter-bar">

                        <div className="search-box">

                            <span>⌕</span>

                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                        </div>


                        <select
                            value={roleFilter}
                            onChange={(e) =>
                                setRoleFilter(e.target.value)
                            }
                        >
                            <option value="all">
                                All Users
                            </option>

                            <option value="student">
                                Students
                            </option>

                            <option value="teacher">
                                Teachers
                            </option>

                            <option value="admin">
                                Admins
                            </option>

                        </select>

                    </div>


                    {/* TABLE */}

                    <div className="users-table-container">

                        <table className="users-table">

                            <thead>

                                <tr>

                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Joined</th>
                                    <th>Action</th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredUsers.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="empty-users"
                                        >
                                            No users found.
                                        </td>

                                    </tr>

                                ) : (

                                    filteredUsers.map((user) => (

                                        <tr key={user._id}>

                                            <td>

                                                <div className="table-user">

                                                    <div className="user-avatar">
                                                        {user.name
                                                            ?.charAt(0)
                                                            .toUpperCase()}
                                                    </div>

                                                    <strong>
                                                        {user.name}
                                                    </strong>

                                                </div>

                                            </td>


                                            <td className="email-cell">
                                                {user.email}
                                            </td>


                                            <td>

                                                <span
                                                    className={`role-badge ${user.role}`}
                                                >
                                                    {user.role}
                                                </span>

                                            </td>


                                            <td>

                                                <span
                                                    className={
                                                        user.isActive
                                                            ? "status-active"
                                                            : "status-inactive"
                                                    }
                                                >
                                                    <span></span>

                                                    {user.isActive
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>

                                            </td>


                                            <td>

                                                {user.createdAt
                                                    ? new Date(
                                                        user.createdAt
                                                    ).toLocaleDateString(
                                                        "en-IN"
                                                    )
                                                    : "—"}

                                            </td>


                                            <td>

                                                  {user.role === "admin" ? (

    <span className="admin-account">
        Admin
    </span>

) : !user.isActive ? (

    <button
        className="approve-btn"
        onClick={() =>
            approveUser(user._id)
        }
    >
        Approve
    </button>

) : (

    <button
        className="deactivate-btn"
        onClick={() =>
            toggleUserStatus(user._id)
        }
    >
        Deactivate
    </button>

)}

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default AdminDashboard;