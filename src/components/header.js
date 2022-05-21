import * as React from "react"
import PropTypes from "prop-types"
import "../css/bootstrap.min.css"
import {
  Nav,
  Navbar,
  Container,
} from "react-bootstrap"
import { StaticImage } from "gatsby-plugin-image"



const Header = ({ siteTitle }) => (
  <header
    style={{
    //  background: `#071543`,
    //  marginBottom: `1.45rem`,
    }}
  >


<Navbar className="topmenu" variant="dark">
    <Container>
    <Navbar.Brand href="https://jhchg.net"> 
    <StaticImage
                    src="../images/logo.png"
                    width={120}
                    quality={95}
                    formats={["auto", "webp", "avif"]}
                    alt="A Gatsby astronaut"
                    style={{ marginBottom: `1.45rem` }}
                  />
    </Navbar.Brand>

   
    <Nav className="justify-content-end">
      <Nav.Link href="https://jhchg.net" ><span style={{
color:"#D3D761",
fontWeight:"600",
fontSize: "22px",
fontfamily: "system-ui"

      }}>世界的改變，一切從{" "}JINHE{" "}開始</span></Nav.Link>
      
    </Nav>
    </Container>
  </Navbar>
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
 //       padding: `1.45rem 1.0875rem`,
      }}
    >


    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
