import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import { checkFiltered, checkRewrite, checkBlackList, checkNotFilteredNotFound, checkWhiteList } from '../../../helpers/helpers';

const getFilterName = (id, filters, t) => {
    if (id === 0) {
        return t('filtered_custom_rules');
    }

    const filter = filters.find(filter => filter.id === id);

    if (filter && filter.name) {
        return t('query_log_filtered', { filter: filter.name });
    }

    return '';
};

const getTitle = (reason, filterName, t) => {
    if (checkNotFilteredNotFound(reason)) {
        return t('check_not_found');
    }

    if (checkRewrite(reason)) {
        return t('rewrite_applied');
    }

    if (checkBlackList(reason)) {
        return filterName;
    }

    if (checkWhiteList(reason)) {
        return (
            <Fragment>
                <div>
                    {t('host_whitelisted')}
                </div>
                <div>
                    {filterName}
                </div>
            </Fragment>
        );
    }

    return (
        <Fragment>
            <div>
                {t('check_reason', { reason })}
            </div>
            <div>
                {filterName}
            </div>
        </Fragment>
    );
};

const getColor = (reason) => {
    if (checkFiltered(reason)) {
        return 'red';
    } else if (checkRewrite(reason)) {
        return 'blue';
    } else if (checkWhiteList(reason)) {
        return 'green';
    }

    return '';
};

const Info = ({
    filters,
    hostname,
    reason,
    filter_id,
    rule,
    service_name,
    cname,
    ip_addrs,
    t,
}) => {
    const filterName = getFilterName(filter_id, filters, t);
    const title = getTitle(reason, filterName, t);
    const color = getColor(reason);

    return (
        <div className={`card mb-0 p-3 ${color}`}>
            <div>
                <strong>{hostname}</strong>
            </div>

            <div>{title}</div>

            {rule && (
                <div>{t('check_rule', { rule })}</div>
            )}

            {service_name && (
                <div>{t('check_service', { service: service_name })}</div>
            )}

            {cname && (
                <div>{t('check_cname', { cname })}</div>
            )}

            {ip_addrs && (
                <div>
                    {t('check_ip', { ip: ip_addrs.join(', ') })}
                </div>
            )}
        </div>
    );
};

Info.propTypes = {
    filters: PropTypes.array.isRequired,
    hostname: PropTypes.string.isRequired,
    reason: PropTypes.string.isRequired,
    filter_id: PropTypes.number,
    rule: PropTypes.string,
    service_name: PropTypes.string,
    cname: PropTypes.string,
    ip_addrs: PropTypes.array,
    t: PropTypes.func.isRequired,
};

export default withNamespaces()(Info);
