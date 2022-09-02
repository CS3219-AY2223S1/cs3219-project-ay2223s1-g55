import { useSession } from "../context/session.context";

const DefaultLayout = ({ children }) => {
    const { user } = useSession();

    return (
        <div>
            <div>
                {user?.username ?? 'Not logged in'}
            </div>
            {children}
        </div>
    )
}

export default DefaultLayout;