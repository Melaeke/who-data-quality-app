import React from 'react'

import PropTypes from 'prop-types';

const AboutPage = ({version}) => (
    <>
        <h3>WHO Data Quality Tool</h3>
        <div style={{maxWidth: "800px"}}>
            <p><em>Version: {version}</em></p>
            <p>
                <em>Copyright © World Health Organization (WHO) [2017]. </em>All rights reserved.
            </p>
            <p>
                This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3).
                In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under
                national or international law or submit to any national court jurisdiction.
            </p>


            <h4>WHO Data Quality Tool Terms of Use and Disclaimers</h4>

            <p>The WHO Data Quality Tool application for the DHIS2 information platform (the “app”) is a product of WHO.</p>

            <p>The app is available for download without charge on the DHIS2 website. By using the app, the user agrees to these
                terms of use and disclaimers. Please read through them carefully.</p>

            <p>The app performs analyses on data inputted in DHIS2 at the demand of the user. The app does not provide or include
                any content, from WHO or otherwise, and WHO has no affiliation with, and makes no statement regarding, content
                inputted to the app by user, nor does use of the app imply any relationship between WHO and the user.</p>

            <p>WHO makes no warranties or representations regarding the contents, appearance, completeness, technical
                specifications, or accuracy of the app. WHO disclaims all responsibility relating to, and shall not be liable for,
                any use of the app, the results of such use, or the reliance thereon.</p>

            <p>WHO reserves the right to make updates and changes to the app without notice, and accepts no liability for any errors
                or omissions in this regard.</p>

            <p>The user of the app is responsible for the interpretation and use of the analysis and outputs performed by the app.
                The submission of content to the app does not imply WHO’s approval or endorsement of that content, or that the
                content is appropriate for any purpose or meets any established standard or requirement.</p>

            <p>The user shall not, in connection with use of the app, state or imply that WHO endorses or is affiliated with the user,
                its use of the app, or any content, output, or analysis resulting from or related to the app or DHIS2, or that WHO
                endorses any entity, organization, company, or product.</p>

            <p>Any designations employed or presentation by the user in its use of the app, including tables and maps, do not imply
                the expression of any opinion whatsoever on the part of the World Health Organization concerning the legal status
                of any country, territory, city or area or of its authorities, or concerning the delimitation of its frontiers
                and boundaries.</p>

            <p>Any mention of specific companies or of certain manufacturers' products by the user in its use of the app does not
                imply that they are endorsed or recommended by the World Health Organization in preference to others of a similar
                nature that are not mentioned.</p>


            <p>
                Nothing in or relating herein or to the use of the app shall be deemed a waiver of any of the privileges and
                immunities enjoyed by WHO under national or international law and/or as submitting WHO to any national court
                jurisdiction.
            </p>

            <hr />

        </div>
    </>
)

AboutPage.propTypes = {
    version: PropTypes.string.isRequired
}

export default AboutPage;