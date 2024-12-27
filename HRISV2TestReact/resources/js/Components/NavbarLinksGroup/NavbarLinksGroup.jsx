import { useState } from 'react';
import { IconCalendarStats, IconChevronRight } from '@tabler/icons-react';
import { Box, Collapse, Group, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import classes from './NavbarLinksGroup.module.css';
export function LinksGroup({ icon: Icon, label, initiallyOpened, link, links }) {
    const hasLinks = Array.isArray(links) && links.length > 0;
    const [opened, setOpened] = useState(initiallyOpened || false);
    const items = hasLinks
        ? links.map((nestedLink) => (
            <Text
                component="a"
                className={classes.link}
                href={nestedLink.link}
                key={nestedLink.label}
                style={{ marginLeft: "15px" }}
            >
                <span style={{marginLeft: "10px"}}>{nestedLink.label}</span>
            </Text>
        ))
        : null;
    return (<>
        <UnstyledButton
            onClick={() => hasLinks && setOpened((o) => !o)}
            className={classes.control}
            component={!hasLinks ? 'a' : 'div'}
            href={!hasLinks ? link : undefined}
            style={{marginTop:20, paddingLeft: 5}}
        >
            <Group justify="space-between" gap={0}>
                <Box style={{ display: 'flex', alignItems: 'center' }}>
                    <ThemeIcon variant="light" size={30}>
                        <Icon size={18} />
                    </ThemeIcon>
                    <Box ml="md">{label}</Box>
                </Box>
                {hasLinks && (<IconChevronRight className={classes.chevron} stroke={1.5} size={16} style={{ transform: opened ? 'rotate(-90deg)' : 'none' }} />)}
            </Group>
        </UnstyledButton>
        {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>);
}

export function NavbarLinksGroup() {
    return;
}