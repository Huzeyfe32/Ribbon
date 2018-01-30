/*
 *   This file is part of Ribbon
 *   Copyright (C) 2017-2018 Favna
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, version 3 of the License
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *   Additional Terms 7.b and 7.c of GPLv3 apply to this file:
 *       * Requiring preservation of specified reasonable legal notices or
 *         author attributions in that material or in the Appropriate Legal
 *         Notices displayed by works containing it.
 *       * Prohibiting misrepresentation of the origin of that material,
 *         or requiring that modified versions of such material be marked in
 *         reasonable ways as different from the original version.
 */

const commando = require('discord.js-commando'),
	{oneLine} = require('common-tags'),
	path = require('path'),
	MAX_SONGS = require(path.join(__dirname, 'data/GlobalData.js')).MAX_SONGS; // eslint-disable-line sort-vars

module.exports = class MaxSongsCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'maxsongs',
			'aliases': ['songcap', 'songmax', 'maxsong'],
			'group': 'music',
			'memberName': 'maxsongs',
			'description': 'Shows or sets the max songs per user.',
			'format': '[amount|"default"]',
			'details': oneLine `
            This is the maximum number of songs a user may have in the queue.
            The default is ${MAX_SONGS}.
            Only administrators may change this setting.
        `,
			'examples': ['maxsongs 3'],
			'guildOnly': true,
			'throttling': {
				'usages': 2,
				'duration': 3
			}
		});
	}

	deleteCommandMessages (msg) {
		if (msg.deletable && this.client.provider.get(msg.guild, 'deletecommandmessages', false)) {
			msg.delete();
		}
	}

	hasPermission (msg) {
		return this.client.isOwner(msg.author) || msg.member.hasPermission('ADMINISTRATOR');
	}

	run (msg, args) {
		if (!args) {
			const maxSongs = this.client.provider.get(msg.guild.id, 'maxSongs', MAX_SONGS);

			return msg.reply(`the maximum songs a user may have in the queue at one time is ${maxSongs}.`);
		}

		if (args.toLowerCase() === 'default') {
			this.client.provider.remove(msg.guild.id, 'maxSongs');

			return msg.reply(`set the maximum songs to the default (currently ${MAX_SONGS}).`);
		}

		const maxSongs = parseInt(args, 10);

		if (isNaN(maxSongs) || maxSongs <= 0) {
			return msg.reply('invalid number provided.');
		}

		this.client.provider.set(msg.guild.id, 'maxSongs', maxSongs);

		return msg.reply(`set the maximum songs to ${maxSongs}.`);
	}
};