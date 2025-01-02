import React from "react";
import { useForm, usePage } from "@inertiajs/react";
import {
  IconClockHour2,
  IconUser,
  IconNotes,
  IconLogout
} from '@tabler/icons-react';
import { Code, Group, ScrollArea, Text, UnstyledButton } from '@mantine/core';
import classes from './NavbarCSS.module.css'
import { LinksGroup } from './NavbarLinksGroup/NavbarLinksGroup';


export default function Navbar() {
  const { auth } = usePage().props;
  const { post } = useForm();

  const handleLogout = (e) => {
    e.preventDefault();
    post('/logout');
  }
  const navbardata = [
    { label: 'User Dashboard', icon: IconUser, link: '/UT_Module/ut_dashboard' },
    {
      label: 'Undertime',
      icon: IconClockHour2,
      initallyOpened: false,
      links: [
        { label: 'UT Entry', link: '/UT_Module/ut_entry' },
        { label: 'UT Approval', link: '/UT_Module/ut_appr_list' },
        { label: 'UT Reports', link: '/UT_Module/ut_reports_list' }

      ]
    },
    {
      label: 'Overtime',
      icon: IconClockHour2,
      initallyOpened: false,
      links: [
        { label: 'OT Entry', link: '/OT_Module/ot_entry' },
        { label: 'OT Approval', link: '/OT_Module/ot_appr_list' },
        { label: 'OT Reports', link: '/OT_Module/ot_reports_list' }

      ]
    },
    {
      label: 'Official Business',
      icon: IconNotes,
      iniitallyOpened: false,
      links: [
        { label: 'OB Entry', link: '/OB_Module/ob_entry' },
        { label: 'OB Approval', link: '/OB_Module/ob_appr_list' },
        { label: 'OB Reports', link: '/OB_Module/ob_reports_list' }

      ]
    },
    {
      label: 'Leave',
      icon: IconNotes,
      iniitallyOpened: false,
      links: [
        { label: 'Leave Entry', link: '/Leave_Module/leave_entry' },
        { label: 'Leave Approval', link: '/Leave_Module/leave_appr_list' },
        { label: 'Leave Reports', link: '/Leave_Module/leave_reports_list' }

      ]
    }
  ]
  const links = navbardata.map((item) => <LinksGroup {...item} key={item.label} />);
  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Group justify="space-between">
          <img className={classes.image} src="/images/WINTERPINE.png" alt="aa" />
        </Group>
      </div>


      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>


      {auth.user ?
        <div className={classes.footer}>

          <UnstyledButton className={classes.user}>
            <Group>
              <div style={{ flex: 1, marginLeft: "5px" }}>
                <Text size="lg" fw={500}>
                  {auth.user.name}
                </Text>
              </div>
              <a className={classes.link} style={{ textDecoration: "none" }} onClick={handleLogout} >
                <IconLogout className={classes.linkIcon} stroke={1.5} />
                <span style={{ color: "black", marginRight: "10px" }}>Logout</span>
              </a>
            </Group>
          </UnstyledButton>

        </div> : null}

    </nav>

  );
};
