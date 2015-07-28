define([
	"dojo/_base/lang",
	'dojo/_base/array'
], function ( lang, array) {

	var obj = {};

	var add = function(name,cfg){
		lang.setObject(
			name,
			lang.mixin({},cfg),
			obj
		);
	};


	add('device.utility', {
		'ap': [
				{ name: 'Client Information' }, //all
				{ name: 'Layer 2 Neighbor Information', type: 'layerNeighborInformation' }, //all only can select one device
				{
					name: 'Diagnostics',
					children: [
						{ name: 'Ping' },
						{ name: 'Show Log' },
						{ name: 'Show Version' },
						{ name: 'Show Running Config' },
						{ name: 'Show IP Routes' },
						{ name: 'Show MAC Routes' },
						{ name: 'Show ARP Cache' },
						{ name: 'Show Roaming Cache' },
						{ name: 'Show DNXP Neighbors' },
						{ name: 'Show DNXP Cache' },
						{ name: 'Show AMRP Tunnel' },
						{ name: 'Show GRE Tunnel' },
						{ name: 'Show IKE Event' },
						{ name: 'Show IKE SA' },
						{ name: 'Show IPsec SA' },
						{ name: 'Show IPsec Tunnel' },
						{ name: 'Show CPU' },
						{ name: 'Show Memory' }
					]
				},
				{
					name: 'Status',
					children: [
						{ name: 'Advanced Channel Selection Protocol' },
						{ name: 'Interface' },
						{ name: 'Wi-Fi Status Summary', type: 'wifiStatusSummary'}
					]
				}, //all switch only support interface
				{ name: 'Reset Device to Default' }, //all
				{ name: 'Locate Device' }, //only support ap, only can select one device
				// {
				// 	name: 'LLDP/CDP',
				// 	children: [
				// 		{ name: 'LLDP/CDP Clear', type: 'lldpCdpClear' },
				// 		{ name: 'Show LLDP Parameters' },
				// 		{ name: 'Show LLDP Neighbors' },
				// 		{ name: 'Show CDP Parameters' },
				// 		{ name: 'Show CDP Neighbors '}
				// 	]
				// }, //switch and ap, only one
				{ name: 'Get Tech Data' }, //all
			],
	'ap2': [

				{ name: 'Client Information' }, //all
				{ name: 'Reset Device to Default' }, //all
				{ name: 'Get Tech Data'} //all
			],
	'sr': [
				{ name: 'Client Information' }, //all
				{
					name: 'Diagnostics',
					children: [
						{ name: 'Ping' },
						{ name: 'Show Log' },
						{ name: 'Show MAC Table' },
						{ name: 'Show Version' },
						{ name: 'Show Running Config' },
						{ name: 'Show IP Routes' },
						{ name: 'Show CPU' },
						{ name: 'Show Memory' },
						{ name: 'Show PSE '}
					]
				},
				{
					name: 'Status',
					children: [
						{ name: 'Interface '}
					]
				}, //all switch only support interface
				{ name: 'Reset PSE' }, // only switch
				{ name: 'Reset Device to Default' }, //all
				// {
				// 	name: 'LLDP/CDP',
				// 	children: [
				// 		{ name: 'LLDP/CDP Clear', type: 'lldpCdpClear' },
				// 		{ name: 'Show LLDP Parameters' },
				// 		{ name: 'Show LLDP Neighbors' },
				// 		{ name: 'Show CDP Parameters' },
				// 		{ name: 'Show CDP Neighbors '}
				// 	]
				// },, //all
				{ name: 'Get Tech Data'} //all
			],
	'sr2': [
				{ name: 'Client Information' }, //all
				{ name: 'Reset PSE' }, // only swit ch
				{ name: 'Reset Device to Default' }, //all
 			],
	'apsr': [

				{ name: 'Client Information' },
				{ name: 'Reset Device to Default' },
				{ name: 'Get Tech Data'}
			],
			'none': []
	});



	add('device.actions', {
		items : [
			{name : 'Assign Location', type : 'assignLocation'},
			{name : 'Reboot', type : 'reboot'},
			{name : 'Assign Country Code', type : 'assignCountryCode'},
			{
				name: 'Advanced',
				children: [
					{ name: 'CLI Access', type: 'cliWindow' },
					{ name: 'Bootstrap Configuration', type: 'configureBootstrap' },
					{name : 'Update Netdump Settings', type : 'configureNetdump'}
				]
			},
			{
				name: "Change Management Status",
				children: [
					{name : 'Manage Devices', type : 'manageDevices'},
					{name : 'Unmanage Devices', type : 'unmanageDevices'}
				]
			}
		]
	});

	add('security.rougeAp.actions', {
		items : [
					{ name: 'Neighbor', type: 'neighbor' },
					{ name: 'Removed', type: 'removed' },	
					{ name: 'Auto-classify', type: 'rogue' }
				]
	});

	add('security.rougeClient.actions', {
		items : [
			{ name: 'Rogue', type: 'rogue' },
			{ name: 'Removed', type: 'removed' }
		]
	});

	add('config.switchTmpl.actions', {
		items: [
			{
				name: 'Port Type',
				title: true,
				icon: 'wired'
			},
			{
				name: 'Choose Existing',
				type: 'choosePortType'
			},{
				name: 'Create New',
				type: 'createPortType'
			},
			{
				name: 'Advanced Actions',
				children: [
					{name: 'Aggregate', type: 'aggregate'}
				]
			}
		]
	});

	add('config.apTmpl.actions', {
		items: [
			{
				name: 'Port Type',
				title: true,
				type: 'portIcon',
				icon: 'wired'
			},
			{
				name: 'Choose Existing',
				type: 'choosePortType'
			},{
				name: 'Create New',
				type: 'createPortType'
			},
			{
				name: 'Radio Profile',
				title: true,
				type: 'radioIcon',
				icon: 'wireless'
			},
			{
				name: 'Choose Existing',
				type: 'chooseRadioProfile'
			},{
				name: 'Create New',
				type: 'createRadioProfile'
			},
			{
				name: 'Advanced Actions',
                type: 'advanceAction',
				children: [
					{name: 'Aggregate', type: 'aggregate'},
					{name: 'Redundant', type: 'redundant'}
				]
			}
		]
	});

	/**
	* SiderList Object list config
	*
	*/

	add('config.additionalSet.lists', {
		items: [{
			category: 'Management Server',
			lists: [{
				name: 'NTP Server',
				current: true
			}, {
				name: 'DNS Server',
				type: 'dnsServer'
			}, {
				name: 'Syslog Server'
			},{
				name: 'SNMP Server'
			}]
		}, {
			category: 'Policy Settings',
			lists: [{
				name: 'Bonjour Gateway Settings',
			}, {
				name: 'HIVE',
				type: 'hiveProfile'
			}, {
				name: 'Device Time Zone'
			}, {
				name: 'Management & Native VLAN',
				type: 'vlan'
			}, {
				name: 'Device Data Collection',
				type: 'ddCollection'
			}]
		}, {
			category: 'SWITCH SETTINGS',
			lists: [{
				name: 'STP Configurations'
			}, {
				name: 'Storm Control'
			}, {
				name: 'IGMP Settings'
			}]
		}, {
			category: 'NETWORK SERVICES',
			lists: [{
				name: 'LLDP/CDP',
				type: 'lldpCdp'
			}, {
				name: 'Access Console'
			}, {
				name: 'Management Options'
			}, {
				name: 'Location Server'
			}]
		}, {
			category: 'QoS Options',
			lists: [{
				name: 'Classifier Maps'
			}, {
				name: 'Marker Maps'
			}, {
				name: 'QoS Overview'
			}]
		}, {
			category: 'SECURITY',
			lists: [{
				name: 'WIPS'
			}, {
				name: 'Traffic Filter',
				type: 'traffic'
			}]
		}]
	});

	add('config.accountManagement.lists', {
		items: [{
			category: 'ACCOUNTS',
			lists: [{
				name: 'Account Management',
				type: 'accountMng',
				current: true
			},{
				name: 'Account Details',
				type: 'accountDtl',
			}]
		},{
			category: 'ADMINISTRATION',
			lists: [{
				name: 'License Management',
				type: 'licenseMng'
			},{
				name: 'Device Management Settings',
				type: 'deviceMng'
			},{
				name: 'API Token Management',
				type: 'xapiTokenMng'
			},{
				name: 'Backup and Restore',
				type: 'backupRestore'
			}]
		},{
			category: 'SYSTEM SETTINGS',
			lists: [{
				name: 'HTTPS Certificate',
				type: 'httpsCertificate'
			},{
				name: 'Email Server / NTP Server',
				type: 'emailNtpServer'
			},{
				name: 'Technical Support Data',
				type: 'systemTechData'
			},{
				name: 'Image and Application Signature',
				type: 'imageAppSigature'
			},{
				name: 'Patch and Upgrade',
				type: 'systemPatchUpgrade'
			}]
		},{
			category: 'LOGS',
			lists: [{
				name: 'Audit Logs',
				type: 'auditLogs',
			},{
				name: 'VHM Logs',
				type: 'vhmLogs',
			},{
				name: 'KDDR Logs',
				type: 'kddrLogs',
			}]
		}]
	});


	add('config.devManagement.lists', {
		items: function(deviceId) {
			return [{
				category: 'Device Details',
				tmpl: 'makeTmpl'
			}, {
				category: 'monitoring',
				lists: [{
					name: 'Overview',
					href: '#/devices/' + deviceId + '/overview',
					current: true
				}, {
					name: 'Wireless Interfaces',
					type: 'wireless',
					href: '#/devices/' + deviceId + '/wireless'
				}, {
					name: 'Wired Interfaces',
					type: 'wired',
					href: '#/devices/' + deviceId + '/wired'
				}, {
					name: 'Connected Client',
					type: 'connected',
					href: '#/devices/' + deviceId + '/clients'
				}, {
					name: 'Events',
					type: 'alarms',
					href: '#/devices/' + deviceId + '/alarms'
				}]
			}, {
				category: 'Configuration',
				lists: [{
					name: 'Device Configuration',
					type: 'devicecfg',
					href: '#/devices/' + deviceId + '/device-config'
				}, {
					name: 'Interface Settings',
					type: 'intefaceSet',
					href: '#/devices/' + deviceId + '/interface-settings'
				}, {
					name: 'Interface Settings',
					type: 'intefaceSetForSwitch',
					href: '#/devices/' + deviceId + '/switch-settings'
				}, {
					name: 'Configure Netdump',
					type: 'netdumpSet',
					href: '#/devices/' + deviceId + '/netdump-settings'
				}]
			}, {
				category: 'ADDITIONAL DEVICE SETTINGS',
				lists: [{
					name: 'DHCP service',
					type: 'DHCP',
					href: '#/devices/' + deviceId + '/dhcp'
				}, {
					name: 'Radius Requests',
					type: 'radiusRqs',
					href: '#/devices/' + deviceId + '/radius-request'
				}, {
					name: 'Device Credentials',
					type: 'credentials',
					href: '#/devices/' + deviceId + '/credentials'
				}, {
					name: 'Neighboring Devices',
					type: 'neighborDevice',
					href: '#/devices/' + deviceId + '/neighboring-devices'
				}, {
					name: 'Bonjour Gateway Settings',
					type: 'gatewayCfg',
					href: '#/devices/' + deviceId + '/gateway-config'
				}, {
					name: 'Troubleshooting',
					type: 'troubleshooting',
					href: '#/devices/' + deviceId + '/troubleshooting'
				}, {
					name: 'Get Tech Data',
					type: 'techdata',
					href: '#/devices/' + deviceId + '/tech-data'
				}]
			}];
		}
	});

	add('monitor.secManagement.lists', {
		items:
		[{
			category: 'WIPS',
			lists: [{
				name: 'Rogue APs',
				type: 'rogueaps',
				href: '#/security/rogueaps'
			}, {
				name: 'Rogue Clients',
				type: 'rogueclients',
				href: '#/security/rogueclients'
			}]
		}]
	});


	add('config.commonObject.lists', {
		items : [{
			category: 'Policy',
			lists: [{
					name: 'Hives',
					current: 'true'
				}, {
					name: 'Port Types'
				}, {
					name: 'Radio Profiles'
				}, {
					name: 'Schedules'
				}, {
					name: 'SSIDs',
					type: 'ssidManage'
				}, {
					name: 'User Profiles',
					type: 'userProfile'
			}, {
				name: 'Bonjour Gateway Settings'
			}]
		}, {
			category: 'Basic',
			lists: [{
					name: 'IP Objects/Host Names',
					type: 'ipObjectManage'
				}, {
					name: 'MAC Objects/MAC OUIs',
					type: 'macObjs'
				}, {
					name: 'OS Objects',
					type: 'osObjects'
				}, {
					name: 'VLANs'
			}]
		}, {
			category: 'Security',
			lists: [{
					name: 'IP Firewall Policies',
					type: 'ipFirewallPolicies'
				}, {
					name: 'MAC Firewall Policies'
				}, {
					name: 'Traffic Filters'
				}, {
					name: 'WIPS Policies',
					type: 'wipsPolicies'
			}]
		}, {
			category: 'QoS',
			lists: [{
					name: 'Classifier Maps'
				}, {
					name: 'Marker Maps',
					type: 'markerMaps'
				}, {
					name: 'Rate Control & Queuing',
					type: 'rateLimit'
			}]
		}, {
			category: 'Management',
			lists: [{
					name: 'DNS Servers',
					type: 'dnsAssignments'
				}, {
					name: 'NTP Servers',
					type: 'ntpAssignments'
				}, {
					name: 'SNMP Servers',
					type: 'snmpAssignments'
				}, {
					name: 'Syslog Servers',
					type: 'syslogAssignments'
			}]
		}, {
			category: 'Network',
			lists: [{
					name: 'Access Consoles'
				}, {
					name: 'LLDP/CDP Profiles',
					type: 'lldpProfile'
				}, {
					name: 'Location Servers',
					type: 'locationServers'
				}, {
					name: 'Management Options'
				}, {
					name: 'Tunnel Policies',
					type: 'tunnelPolicies'
			}]
		}, {
			category: 'Authentication',
			lists: [{
					name: 'AAA Server Settings',
					type: 'aaaServerSettings'
				}, {
					name: 'AD Servers'
				}, {
					name: 'Captive Web Portals',
					type: 'cwp'
				}, {
					name: 'External RADIUS Servers',
					type: 'extServers'
				}, {
					name: 'LDAP Servers'
			}]
		}, {
			category: 'Certificate',
			lists: [{
					name: 'Certificate Management',
					type: 'certManagement'
			}]
		}]
	});


	add('report.list', {
		items : [{
			category : 'My Reports',
			lists : [{
				name : 'Generated Reports',
				type : 'generated',
				current : true
			},{
				name: 'Upcoming Reports',
				type: 'upcoming'
			}/*,{
				name: 'Expired Reports',
				type: 'expired'
			}*/]
		}]
	});

	return obj;
});
