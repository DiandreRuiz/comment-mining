import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Search from "./Search/Search";

const Layout: React.FC = () => {
    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={6} xs={12} className="mt-4 text-center">
                    <Search />
                </Col>
            </Row>
            <Row>
                <Col></Col>
            </Row>
        </Container>
    );
};

export default Layout;
