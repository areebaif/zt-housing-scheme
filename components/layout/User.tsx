import * as React from "react";
import { useSession } from "next-auth/react";
import {
  IconUser,
} from "@tabler/icons-react";
import {
  UnstyledButton,
  Group,
  Text,
  Box,
  useMantineTheme,
  ThemeIcon,
} from "@mantine/core";

export const User: React.FC = () => {
  const theme = useMantineTheme();
  const { data: session } = useSession();
  const userName = session?.user?.name;
  const email = session?.user?.email;
  return (
    <Box
      sx={{
        paddingTop: theme.spacing.sm,
        borderTop: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
      }}
    >
      <UnstyledButton
        sx={{
          display: "block",
          width: "100%",
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color:
            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
          },
        }}
      >
        <Group>
          <ThemeIcon color={"grape"} variant="light">
            <IconUser size={20} />
          </ThemeIcon>
          {/* <Avatar
            src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
            radius="xl"
          /> */}
          <Box sx={{ flex: 1 }}>
            <Text size="sm" weight={500}>
              {userName}
            </Text>
            <Text color="dimmed" size="xs">
              {email}
            </Text>
          </Box>
          {/* {theme.dir === "ltr" ? (
            <IconChevronRight size={18} />
          ) : (
            <IconChevronLeft size={18} />
          )} */}
        </Group>
      </UnstyledButton>
    </Box>
  );
};
