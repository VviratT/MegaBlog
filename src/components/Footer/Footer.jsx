import React from "react";
import {
  Box,
  Container,
  Typography,
  Link as MuiLink,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Logo from "../Logo";

export default function Footer() {
  const theme = useTheme();
  const footerBg =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.background.paper;
  const linkSx = {
    display: "block",
    mb: 1,
    color: theme.palette.mode === "light" ? "text.primary" : "common.white",
    textDecoration: "none",
    "&:hover": { color: theme.palette.primary.main },
  };

  return (
    <Box
      component="footer"
      sx={{ bgcolor: footerBg, borderTop: 1, borderColor: "divider", py: 6 }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
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
                © {new Date().getFullYear()}. All Rights Reserved.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={9}>
            <Box
              display="flex"
              justifyContent="flex-end"
              flexWrap="wrap"
              gap={4}
            >
              {["Company", "Support", "Legals"].map((grp, i) => (
                <Box key={i}>
                  <Typography
                    variant="overline"
                    gutterBottom
                    color="text.secondary"
                  >
                    {grp}
                  </Typography>
                  {[
                    "Company".includes(grp)
                      ? [
                          "Features",
                          "Pricing",
                          "Affiliate Program",
                          "Press Kit",
                        ]
                      : grp === "Support"
                      ? ["Account", "Help", "Contact Us", "Customer Support"]
                      : ["Terms & Conditions", "Privacy Policy", "Licensing"],
                  ].map((link) => (
                    <MuiLink key={link} href="#" sx={linkSx}>
                      {link}
                    </MuiLink>
                  ))}
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
