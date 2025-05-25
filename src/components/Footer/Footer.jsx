// src/components/Footer.jsx
import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  useTheme,
} from "@mui/material";
import Logo from "../Logo";

export default function Footer() {
  const theme = useTheme();

  // Background: soft grey in light, paper in dark
  const footerBg =
    theme.palette.mode === "light"
      ? theme.palette.grey[400]
      : theme.palette.background.paper;

  // Link styling
  const linkSx = {
    display: "block",
    mb: 1,
    color: theme.palette.mode === "light" ? "text.primary" : "common.white",
    textDecoration: "none",
    "&:hover": {
      color: theme.palette.primary.main,
    },
  };

  return (
    <Box
      component="footer"
      sx={{ bgcolor: footerBg, borderTop: 1, borderColor: "divider", py: 6 }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={4}
          justifyContent="space-between"
          alignItems="flex-start"
        >
          {/* LEFT COLUMN */}
          <Grid item xs={12} md={3}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems={{ xs: "center", md: "flex-start" }}
            >
              <Logo width="80px" />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 2 }}
              >
                © {new Date().getFullYear()}. All Rights Reserved by VviratT09.
              </Typography>
            </Box>
          </Grid>

          {/* RIGHT COLUMN: Grouped links */}
          <Grid item xs={12} md={9}>
            <Box
              display="flex"
              justifyContent="flex-end"
              flexWrap="wrap"
              gap={4}
            >
              {/* Company */}
              <Box>
                <Typography
                  variant="overline"
                  gutterBottom
                  color="text.secondary"
                >
                  Company
                </Typography>
                <MuiLink href="#" sx={linkSx}>
                  Features
                </MuiLink>
                <MuiLink href="#" sx={linkSx}>
                  Pricing
                </MuiLink>
                <MuiLink href="#" sx={linkSx}>
                  Affiliate Program
                </MuiLink>
                <MuiLink href="#" sx={linkSx}>
                  Press Kit
                </MuiLink>
              </Box>

              {/* Support */}
              <Box>
                <Typography
                  variant="overline"
                  gutterBottom
                  color="text.secondary"
                >
                  Support
                </Typography>
                <MuiLink href="#" sx={linkSx}>
                  Account
                </MuiLink>
                <MuiLink href="#" sx={linkSx}>
                  Help
                </MuiLink>
                <MuiLink href="#" sx={linkSx}>
                  Contact Us
                </MuiLink>
                <MuiLink href="#" sx={linkSx}>
                  Customer Support
                </MuiLink>
              </Box>

              {/* Legals */}
              <Box>
                <Typography
                  variant="overline"
                  gutterBottom
                  color="text.secondary"
                >
                  Legals
                </Typography>
                <MuiLink href="#" sx={linkSx}>
                  Terms &amp; Conditions
                </MuiLink>
                <MuiLink href="#" sx={linkSx}>
                  Privacy Policy
                </MuiLink>
                <MuiLink href="#" sx={linkSx}>
                  Licensing
                </MuiLink>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
