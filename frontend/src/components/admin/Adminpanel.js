import React, { useEffect, useState } from "react";
import Adminnavbar from "../partials/adminHeader";
import { useNavigate } from "react-router-dom";

const styles = {
    root: {
        '--sidebar-width': '180px'
    },
    body: {
        backgroundColor: '#f8f9fa'
    },
    mainContent: {
        marginLeft: 'var(--sidebar-width)',
        padding: '20px',
        paddingTop: '20px'
    },
    card: {
        borderRadius: '10px',
        boxShadow: '0.2rem 0.2rem rgba(0, 0, 0, 0.075)',
        marginBottom: '20px',
    },
    cardHeader: {
        backgroundColor: '#fff',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        fontWeight: 600
    },
    statsCard: {
        transition: 'transform 0.3s'
    },

    statsIcon: {
        fontSize: '30px'
    },
    tableResponsive: {
        borderRadius: '10px'
    },
    chartContainer: {
        position: 'relative',
        height: '300px'
    },
    graphh: {
        objectFit: 'contain',
        height: '300px'
    },
    subtlePrimary: {
        backgroundColor: 'rgba(13, 110, 253, 0.1)'
    },
    subtleSuccess: {
        backgroundColor: 'rgba(25, 135, 84, 0.1)'
    },
    subtleWarning: {
        backgroundColor: 'rgba(255, 193, 7, 0.1)'
    },
    subtleInfo: {
        backgroundColor: 'rgba(13, 202, 240, 0.1)'
    }
};

const DashboardOverview = () => {
    const [isAdmin, setIsAdmin] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        const role = localStorage.getItem('userRole')

        if (token && role === "admin") {
            setIsAdmin(true)
        } else {
            setIsAdmin(false)
            navigate('/authentication')
        }
    }, [navigate])

    if (isAdmin === null) return null

    return (
        <>
            <Adminnavbar />
            <div className="main-content" style={styles.mainContent}>
                <div className="container-fluid">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="mb-0">Dashboard Overview</h4>
                        <div>
                            <a className="btn btn-sm btn-primary" href="/admin/addconcert">
                                <i className="bi bi-plus me-1"></i> Add New
                            </a>
                        </div>
                    </div>

                    <div className="row">
                        {[
                            {
                                title: 'Users',
                                value: '2,845',
                                icon: 'bi bi-people',
                                percent: '12.5%',
                                color: 'text-primary',
                                bg: styles.subtlePrimary,
                                link: '/admin/viewusers'
                            },
                            {
                                title: 'Concerts',
                                value: '$18,620',
                                icon: 'bi bi-currency-dollar',
                                percent: '8.2%',
                                color: 'text-success',
                                bg: styles.subtleSuccess,
                                link: '/admin/concerts'
                            },
                            {
                                title: 'Orders',
                                value: '1,753',
                                icon: 'bi bi-cart3',
                                percent: '5.7%',
                                color: 'text-warning',
                                bg: styles.subtleWarning,
                                link: '/admin/allbookings'
                            },
                            {
                                title: 'Ratings',
                                value: '4.8',
                                icon: 'bi bi-star',
                                percent: '2.1%',
                                color: 'text-info',
                                bg: styles.subtleInfo,
                                link: '#'
                            }
                        ].map((stat, index) => (
                            <div className="col-md-3" key={index}>
                                <a href={stat.link} style={{ textDecoration: 'none' }}>
                                    <div className="card statsCard" style={styles.card}>
                                        <div className="card-body">
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shrink-0 me-3">
                                                    <div className="p-3 rounded-3" style={stat.bg}>
                                                        <i className={`${stat.icon} ${stat.color}`}></i>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h6 className="mb-1">{stat.title}</h6>
                                                    <h4 className="mb-0">{stat.value}</h4>
                                                    <small className="text-success">
                                                        <i className="bi bi-arrow-up"></i> {stat.percent}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>


                    <div className="card mt-4" style={styles.card}>
                        <div className="card-header" style={styles.cardHeader}>Recent Orders</div>
                        <div className="table-responsive" style={styles.tableResponsive}>
                            <table className="table table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Customer</th>
                                        <th>Concert</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>Jane Doe</td>
                                        <td>K S Chithra Live In Concert</td>
                                        <td>$99.99</td>
                                        <td><span className="badge bg-success">Booked</span></td>
                                    </tr>
                                    <tr>
                                        <td>2</td>
                                        <td>John Smith</td>
                                        <td>Guns N' Roses: India 2025</td>
                                        <td>$199.99</td>
                                        <td><span className="badge bg-warning">Pending</span></td>
                                    </tr>
                                    <tr>
                                        <td>3</td>
                                        <td>Emily Johnson</td>
                                        <td>Stand Up Comedy</td>
                                        <td>$49.99</td>
                                        <td><span className="badge bg-danger">Cancelled</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="d-flex justify-content-around">
                        <div className="card mt-4 statsCard" style={styles.card}>
                            <div className="card-header" style={styles.cardHeader}>Sales Overview</div>
                            <div style={styles.chartContainer}>
                                <img
                                    src="/1645185782590.png"
                                    alt="Sales chart"
                                    style={styles.graphh}
                                    className="w-100"
                                />
                            </div>
                        </div>

                        <div className="card mt-4 statsCard" style={styles.card}>
                            <div className="card-header" style={styles.cardHeader}>Recent Activity</div>
                            <div className="card-body">
                                <ul className="list-unstyled mb-0">
                                    <li><i className="bi bi-check-circle text-success me-2"></i> User Jane signed up.</li>
                                    <li><i className="bi bi-cart-check text-primary me-2"></i> Order #1124 was placed.</li>
                                    <li><i className="bi bi-star text-warning me-2"></i> John rated a product 5 stars.</li>
                                    <li><i className="bi bi-x-circle text-danger me-2"></i> Payment failed for Order #1120.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <style jsx>{`
                        .statsCard:hover {
                            transform: translateY(-8px);
                            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
                        }
                    `}</style>
                </div>
            </div>
        </>
    );
};

export default DashboardOverview;
