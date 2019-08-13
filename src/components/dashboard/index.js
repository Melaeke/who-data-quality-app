import React from 'react'

import { TabBar, Tab } from '@dhis2/ui-core'

const DashboardComponent = () => {
    //TODO: add i18n and make dynamic
    return (
        <TabBar fixed>
            <Tab selected>Completeness</Tab>
            <Tab>Consistency - time</Tab>
            <Tab>Consistency - data</Tab>
            <Tab>Outliers</Tab>
        </TabBar>
    )
}

export default DashboardComponent
