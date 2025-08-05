import {
  Box,
  Typography,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  Button,
} from "@mui/material";
import Link from "next/link";

export default function AboutPIM() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Hero Section */}
      <Box textAlign="center" mb={8}>
        <Typography variant="h2" gutterBottom sx={{ fontWeight: "bold" }}>
          Powering Your Product Information
        </Typography>
        <Typography variant="h5" color="primary">
          The modern PIM solution for seamless data management
        </Typography>
      </Box>

      {/* Value Proposition */}
      <Grid container spacing={6} alignItems="center" mb={8}>
        <Grid>
          <Typography variant="h3" gutterBottom>
            Why Our PIM?
          </Typography>
          <Typography paragraph fontSize="1.1rem">
            In today's omnichannel commerce landscape, consistent and accurate
            product information is non-negotiable. Our PIM system centralizes
            all your product data, eliminating silos and ensuring brand
            consistency across all touchpoints.
          </Typography>

          <List dense>
            {[
              "Centralized product data repository",
              "Multi-channel distribution",
              "Real-time collaboration tools",
              "AI-powered data enrichment",
              "Seamless ERP/CRM integration",
              "Automated workflow approvals",
            ].map((item) => (
              <ListItem key={item}>
                <ListItemIcon></ListItemIcon>
                <Typography>{item}</Typography>
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid></Grid>
      </Grid>

      {/* Key Features Section */}
      <Box mb={8}>
        <Typography variant="h3" textAlign="center" gutterBottom>
          Core Capabilities
        </Typography>
        <Grid container spacing={4}>
          {[
            {
              title: "Digital Asset Management",
              desc: "Centralized media library with version control for all product assets",
            },
          ].map((feature, index) => (
            <Grid key={index}>
              <Box
                p={3}
                height="100%"
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h5" gutterBottom color="primary">
                  {feature.title}
                </Typography>
                <Typography>{feature.desc}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* CTA Section */}
      <Box textAlign="center" mt={6}>
        <Typography variant="h4" gutterBottom>
          Ready to transform your product information management?
        </Typography>
        <Link href={"/management"}>
          <Button
            variant="contained"
            size="large"
            sx={{
              mt: 3,
              px: 6,
              py: 1.5,
              fontSize: "1.1rem",
            }}
          >
            Let's Try
          </Button>
        </Link>
      </Box>
    </Container>
  );
}
