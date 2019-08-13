import React from 'react'

import { Menu, MenuItem, Divider } from '@dhis2/ui-core'

const MenuComponent = () => {
    return (
        <div className="menu-wrapper">
            <Menu>
                <MenuItem label="Dashboard" />
                <MenuItem label="Analysis" />
                <MenuItem label="Annual report" />
                <MenuItem label="About" />
                <MenuItem label="More">
                    <Menu>
                        <MenuItem label="User manual" />
                        <MenuItem label="Data export for Excel tool" />
                        <MenuItem label="Feedback" />
                        <Divider margin="8px 0" />
                        <MenuItem label="Administration" />
                    </Menu>
                </MenuItem>
            </Menu>
            <style jsx>{`
                .menu-wrapper {
                    max-width: 300px;
                }
            `}</style>
        </div>
    )
}

export default MenuComponent
