import { useSession } from "@/contexts/session.context";
import { Container } from "@mui/material";
import React from "react";

interface DefaultLayoutProps {
    children: React.ReactNode;
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
    const { user } = useSession();

    return (
        <Container>
            <div>{user?.username ?? "Not logged in"}</div>
            {children}
        </Container>
    );
};

export default DefaultLayout;
