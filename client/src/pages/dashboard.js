import get_user from "../DB";

const Dashboard = () => {
    // var user

    return (
        <h1>
            DASHBOARD
            <button onClick={() => console.log(get_user(1))}>Verify User</button>
        </h1>
    );
};

export default Dashboard;