"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("./packet");
const arena_death_1 = require("./../networking/packets/incoming/arena/arena-death");
const imminent_arena_wave_1 = require("./../networking/packets/incoming/arena/imminent-arena-wave");
const delete_pet_message_1 = require("./../networking/packets/incoming/pets/delete-pet-message");
const evolved_pet_message_1 = require("./../networking/packets/incoming/pets/evolved-pet-message");
const hatch_pet_message_1 = require("./../networking/packets/incoming/pets/hatch-pet-message");
const account_list_packet_1 = require("./../networking/packets/incoming/account-list-packet");
const ally_shoot_packet_1 = require("./../networking/packets/incoming/ally-shoot-packet");
const aoe_packet_1 = require("./../networking/packets/incoming/aoe-packet");
const buy_result_packet_1 = require("./../networking/packets/incoming/buy-result-packet");
const client_stat_packet_1 = require("./../networking/packets/incoming/client-stat-packet");
const createsuccess_packet_1 = require("./../networking/packets/incoming/createsuccess-packet");
const damage_packet_1 = require("./../networking/packets/incoming/damage-packet");
const death_packet_1 = require("./../networking/packets/incoming/death-packet");
const enemy_shoot_packet_1 = require("./../networking/packets/incoming/enemy-shoot-packet");
const failure_packet_1 = require("./../networking/packets/incoming/failure-packet");
const global_notification_packet_1 = require("./../networking/packets/incoming/global-notification-packet");
const goto_packet_1 = require("./../networking/packets/incoming/goto-packet");
const guild_result_packet_1 = require("./../networking/packets/incoming/guild-result-packet");
const inv_result_packet_1 = require("./../networking/packets/incoming/inv-result-packet");
const invited_to_guild_packet_1 = require("./../networking/packets/incoming/invited-to-guild-packet");
const key_info_response_packet_1 = require("./../networking/packets/incoming/key-info-response-packet");
const mapinfo_packet_1 = require("./../networking/packets/incoming/mapinfo-packet");
const name_result_packet_1 = require("./../networking/packets/incoming/name-result-packet");
const new_ability_message_1 = require("./../networking/packets/incoming/new-ability-message");
const newtick_packet_1 = require("./../networking/packets/incoming/newtick-packet");
const notification_packet_1 = require("./../networking/packets/incoming/notification-packet");
const password_prompt_packet_1 = require("./../networking/packets/incoming/password-prompt-packet");
const ping_packet_1 = require("./../networking/packets/incoming/ping-packet");
const quest_objectid_packet_1 = require("./../networking/packets/incoming/quest-objectid-packet");
const quest_redeem_response_packet_1 = require("./../networking/packets/incoming/quest-redeem-response-packet");
const reconnect_packet_1 = require("./../networking/packets/incoming/reconnect-packet");
const reskin_unlock_packet_1 = require("./../networking/packets/incoming/reskin-unlock-packet");
const server_player_shoot_packet_1 = require("./../networking/packets/incoming/server-player-shoot-packet");
const show_effect_packet_1 = require("./../networking/packets/incoming/show-effect-packet");
const text_packet_1 = require("./../networking/packets/incoming/text-packet");
const trade_accepted_1 = require("./../networking/packets/incoming/trade-accepted");
const trade_changed_1 = require("./../networking/packets/incoming/trade-changed");
const trade_done_packet_1 = require("./../networking/packets/incoming/trade-done-packet");
const trade_requested_packet_1 = require("./../networking/packets/incoming/trade-requested-packet");
const trade_start_packet_1 = require("./../networking/packets/incoming/trade-start-packet");
const update_packet_1 = require("./../networking/packets/incoming/update-packet");
const verify_email_packet_1 = require("./../networking/packets/incoming/verify-email-packet");
const enter_arena_packet_1 = require("./../networking/packets/outgoing/arena/enter-arena-packet");
const quest_redeem_packet_1 = require("./../networking/packets/outgoing/arena/quest-redeem-packet");
const active_pet_update_request_packet_1 = require("./../networking/packets/outgoing/pets/active-pet-update-request-packet");
const accept_trade_packet_1 = require("./../networking/packets/outgoing/accept-trade-packet");
const aoeack_packet_1 = require("./../networking/packets/outgoing/aoeack-packet");
const buy_packet_1 = require("./../networking/packets/outgoing/buy-packet");
const cancel_trade_packet_1 = require("./../networking/packets/outgoing/cancel-trade-packet");
const change_guild_rank_packet_1 = require("./../networking/packets/outgoing/change-guild-rank-packet");
const change_trade_packet_1 = require("./../networking/packets/outgoing/change-trade-packet");
const check_credits_packet_1 = require("./../networking/packets/outgoing/check-credits-packet");
const choose_name_packet_1 = require("./../networking/packets/outgoing/choose-name-packet");
const create_guild_packet_1 = require("./../networking/packets/outgoing/create-guild-packet");
const create_packet_1 = require("./../networking/packets/outgoing/create-packet");
const edit_account_list_packet_1 = require("./../networking/packets/outgoing/edit-account-list-packet");
const enemy_hit_packet_1 = require("./../networking/packets/outgoing/enemy-hit-packet");
const escape_packet_1 = require("./../networking/packets/outgoing/escape-packet");
const go_to_quest_room_packet_1 = require("./../networking/packets/outgoing/go-to-quest-room-packet");
const gotoack_packet_1 = require("./../networking/packets/outgoing/gotoack-packet");
const ground_damage_packet_1 = require("./../networking/packets/outgoing/ground-damage-packet");
const guild_invite_packet_1 = require("./../networking/packets/outgoing/guild-invite-packet");
const guild_remove_packet_1 = require("./../networking/packets/outgoing/guild-remove-packet");
const hello_packet_1 = require("./../networking/packets/outgoing/hello-packet");
const inv_drop_packet_1 = require("./../networking/packets/outgoing/inv-drop-packet");
const inv_swap_packet_1 = require("./../networking/packets/outgoing/inv-swap-packet");
const join_guild_packet_1 = require("./../networking/packets/outgoing/join-guild-packet");
const key_info_request_packet_1 = require("./../networking/packets/outgoing/key-info-request-packet");
const load_packet_1 = require("./../networking/packets/outgoing/load-packet");
const move_packet_1 = require("./../networking/packets/outgoing/move-packet");
const other_hit_packet_1 = require("./../networking/packets/outgoing/other-hit-packet");
const player_hit_packet_1 = require("./../networking/packets/outgoing/player-hit-packet");
const player_shoot_packet_1 = require("./../networking/packets/outgoing/player-shoot-packet");
const playertext_packet_1 = require("./../networking/packets/outgoing/playertext-packet");
const pong_packet_1 = require("./../networking/packets/outgoing/pong-packet");
const request_trade_packet_1 = require("./../networking/packets/outgoing/request-trade-packet");
const reskin_packet_1 = require("./../networking/packets/outgoing/reskin-packet");
const set_condition_packet_1 = require("./../networking/packets/outgoing/set-condition-packet");
const shootack_packet_1 = require("./../networking/packets/outgoing/shootack-packet");
const square_hit_packet_1 = require("./../networking/packets/outgoing/square-hit-packet");
const teleport_packet_1 = require("./../networking/packets/outgoing/teleport-packet");
const updateack_packet_1 = require("./../networking/packets/outgoing/updateack-packet");
const use_item_packet_1 = require("./../networking/packets/outgoing/use-item-packet");
const use_portal_packet_1 = require("./../networking/packets/outgoing/use-portal-packet");
class Packets {
    static create(type, data) {
        if (!packet_1.PacketType[type]) {
            throw new Error(`Invalid packet type: ${type}`);
        }
        let packet;
        switch (type) {
            case packet_1.PacketType.ARENADEATH:
                packet = new arena_death_1.ArenaDeathPacket(data);
                break;
            case packet_1.PacketType.IMMINENTARENA_WAVE:
                packet = new imminent_arena_wave_1.ImminentArenaWavePacket(data);
                break;
            case packet_1.PacketType.DELETEPET:
                packet = new delete_pet_message_1.DeletePetMessage(data);
                break;
            case packet_1.PacketType.PETCHANGE_FORM_MSG:
                packet = new evolved_pet_message_1.EvolvedPetMessage(data);
                break;
            case packet_1.PacketType.HATCHPET:
                packet = new hatch_pet_message_1.HatchPetMessage(data);
                break;
            case packet_1.PacketType.ACCOUNTLIST:
                packet = new account_list_packet_1.AccountListPacket(data);
                break;
            case packet_1.PacketType.ALLYSHOOT:
                packet = new ally_shoot_packet_1.AllyShootPacket(data);
                break;
            case packet_1.PacketType.AOE:
                packet = new aoe_packet_1.AoePacket(data);
                break;
            case packet_1.PacketType.BUYRESULT:
                packet = new buy_result_packet_1.BuyResultPacket(data);
                break;
            case packet_1.PacketType.CLIENTSTAT:
                packet = new client_stat_packet_1.ClientStatPacket(data);
                break;
            case packet_1.PacketType.CREATESUCCESS:
                packet = new createsuccess_packet_1.CreateSuccessPacket(data);
                break;
            case packet_1.PacketType.DAMAGE:
                packet = new damage_packet_1.DamagePacket(data);
                break;
            case packet_1.PacketType.DEATH:
                packet = new death_packet_1.DeathPacket(data);
                break;
            case packet_1.PacketType.ENEMYSHOOT:
                packet = new enemy_shoot_packet_1.EnemyShootPacket(data);
                break;
            case packet_1.PacketType.FAILURE:
                packet = new failure_packet_1.FailurePacket(data);
                break;
            case packet_1.PacketType.GLOBALNOTIFICATION:
                packet = new global_notification_packet_1.GlobalNotificationPacket(data);
                break;
            case packet_1.PacketType.GOTO:
                packet = new goto_packet_1.GotoPacket(data);
                break;
            case packet_1.PacketType.GUILDRESULT:
                packet = new guild_result_packet_1.GuildResultPacket(data);
                break;
            case packet_1.PacketType.INVRESULT:
                packet = new inv_result_packet_1.InvResultPacket(data);
                break;
            case packet_1.PacketType.INVITEDTOGUILD:
                packet = new invited_to_guild_packet_1.InvitedToGuildPacket(data);
                break;
            case packet_1.PacketType.KEYINFO_RESPONSE:
                packet = new key_info_response_packet_1.KeyInfoResponsePacket(data);
                break;
            case packet_1.PacketType.MAPINFO:
                packet = new mapinfo_packet_1.MapInfoPacket(data);
                break;
            case packet_1.PacketType.NAMERESULT:
                packet = new name_result_packet_1.NameResultPacket(data);
                break;
            case packet_1.PacketType.NEWABILITY:
                packet = new new_ability_message_1.NewAbilityMessage(data);
                break;
            case packet_1.PacketType.NEWTICK:
                packet = new newtick_packet_1.NewTickPacket(data);
                break;
            case packet_1.PacketType.NOTIFICATION:
                packet = new notification_packet_1.NotificationPacket(data);
                break;
            case packet_1.PacketType.PASSWORDPROMPT:
                packet = new password_prompt_packet_1.PasswordPromptPacket(data);
                break;
            case packet_1.PacketType.PING:
                packet = new ping_packet_1.PingPacket(data);
                break;
            case packet_1.PacketType.QUESTOBJID:
                packet = new quest_objectid_packet_1.QuestObjectIdPacket(data);
                break;
            case packet_1.PacketType.QUESTREDEEM_RESPONSE:
                packet = new quest_redeem_response_packet_1.QuestRedeemResponsePacket(data);
                break;
            case packet_1.PacketType.RECONNECT:
                packet = new reconnect_packet_1.ReconnectPacket(data);
                break;
            case packet_1.PacketType.RESKINUNLOCK:
                packet = new reskin_unlock_packet_1.ReskinUnlockPacket(data);
                break;
            case packet_1.PacketType.SERVERPLAYERSHOOT:
                packet = new server_player_shoot_packet_1.ServerPlayerShootPacket(data);
                break;
            case packet_1.PacketType.SHOWEFFECT:
                packet = new show_effect_packet_1.ShowEffectPacket(data);
                break;
            case packet_1.PacketType.TEXT:
                packet = new text_packet_1.TextPacket(data);
                break;
            case packet_1.PacketType.TRADEACCEPTED:
                packet = new trade_accepted_1.TradeAcceptedPacket(data);
                break;
            case packet_1.PacketType.TRADECHANGED:
                packet = new trade_changed_1.TradeChangedPacket(data);
                break;
            case packet_1.PacketType.TRADEDONE:
                packet = new trade_done_packet_1.TradeDonePacket(data);
                break;
            case packet_1.PacketType.TRADEREQUESTED:
                packet = new trade_requested_packet_1.TradeRequestedPacket(data);
                break;
            case packet_1.PacketType.TRADESTART:
                packet = new trade_start_packet_1.TradeStartPacket(data);
                break;
            case packet_1.PacketType.UPDATE:
                packet = new update_packet_1.UpdatePacket(data);
                break;
            case packet_1.PacketType.VERIFYEMAIL:
                packet = new verify_email_packet_1.VerifyEmailPacket(data);
                break;
            case packet_1.PacketType.ENTERARENA:
                packet = new enter_arena_packet_1.EnterArenaPacket(data);
                break;
            case packet_1.PacketType.QUESTREDEEM:
                packet = new quest_redeem_packet_1.QuestRedeemPacket(data);
                break;
            case packet_1.PacketType.ACTIVEPET_UPDATE_REQUEST:
                packet = new active_pet_update_request_packet_1.ActivePetUpdateRequestPacket(data);
                break;
            case packet_1.PacketType.ACCEPTTRADE:
                packet = new accept_trade_packet_1.AcceptTradePacket(data);
                break;
            case packet_1.PacketType.AOEACK:
                packet = new aoeack_packet_1.AoeAckPacket(data);
                break;
            case packet_1.PacketType.BUY:
                packet = new buy_packet_1.BuyPacket(data);
                break;
            case packet_1.PacketType.CANCELTRADE:
                packet = new cancel_trade_packet_1.CancelTradePacket(data);
                break;
            case packet_1.PacketType.CHANGEGUILDRANK:
                packet = new change_guild_rank_packet_1.ChangeGuildRankPacket(data);
                break;
            case packet_1.PacketType.CHANGETRADE:
                packet = new change_trade_packet_1.ChangeTradePacket(data);
                break;
            case packet_1.PacketType.CHECKCREDITS:
                packet = new check_credits_packet_1.CheckCreditsPacket(data);
                break;
            case packet_1.PacketType.CHOOSENAME:
                packet = new choose_name_packet_1.ChooseNamePacket(data);
                break;
            case packet_1.PacketType.CREATEGUILD:
                packet = new create_guild_packet_1.CreateGuildPacket(data);
                break;
            case packet_1.PacketType.CREATE:
                packet = new create_packet_1.CreatePacket(data);
                break;
            case packet_1.PacketType.EDITACCOUNTLIST:
                packet = new edit_account_list_packet_1.EditAccountListPacket(data);
                break;
            case packet_1.PacketType.ENEMYHIT:
                packet = new enemy_hit_packet_1.EnemyHitPacket(data);
                break;
            case packet_1.PacketType.ESCAPE:
                packet = new escape_packet_1.EscapePacket(data);
                break;
            case packet_1.PacketType.QUESTROOM_MSG:
                packet = new go_to_quest_room_packet_1.GoToQuestRoomPacket(data);
                break;
            case packet_1.PacketType.GOTOACK:
                packet = new gotoack_packet_1.GotoAckPacket(data);
                break;
            case packet_1.PacketType.GROUNDDAMAGE:
                packet = new ground_damage_packet_1.GroundDamagePacket(data);
                break;
            case packet_1.PacketType.GUILDINVITE:
                packet = new guild_invite_packet_1.GuildInvitePacket(data);
                break;
            case packet_1.PacketType.GUILDREMOVE:
                packet = new guild_remove_packet_1.GuildRemovePacket(data);
                break;
            case packet_1.PacketType.HELLO:
                packet = new hello_packet_1.HelloPacket(data);
                break;
            case packet_1.PacketType.INVDROP:
                packet = new inv_drop_packet_1.InvDropPacket(data);
                break;
            case packet_1.PacketType.INVSWAP:
                packet = new inv_swap_packet_1.InvSwapPacket(data);
                break;
            case packet_1.PacketType.JOINGUILD:
                packet = new join_guild_packet_1.JoinGuildPacket(data);
                break;
            case packet_1.PacketType.KEYINFO_REQUEST:
                packet = new key_info_request_packet_1.KeyInfoRequestPacket(data);
                break;
            case packet_1.PacketType.LOAD:
                packet = new load_packet_1.LoadPacket(data);
                break;
            case packet_1.PacketType.MOVE:
                packet = new move_packet_1.MovePacket(data);
                break;
            case packet_1.PacketType.OTHERHIT:
                packet = new other_hit_packet_1.OtherHitPacket(data);
                break;
            case packet_1.PacketType.PLAYERHIT:
                packet = new player_hit_packet_1.PlayerHitPacket(data);
                break;
            case packet_1.PacketType.PLAYERSHOOT:
                packet = new player_shoot_packet_1.PlayerShootPacket(data);
                break;
            case packet_1.PacketType.PLAYERTEXT:
                packet = new playertext_packet_1.PlayerTextPacket(data);
                break;
            case packet_1.PacketType.PONG:
                packet = new pong_packet_1.PongPacket(data);
                break;
            case packet_1.PacketType.REQUESTTRADE:
                packet = new request_trade_packet_1.RequestTradePacket(data);
                break;
            case packet_1.PacketType.RESKIN:
                packet = new reskin_packet_1.ReskinPacket(data);
                break;
            case packet_1.PacketType.SETCONDITION:
                packet = new set_condition_packet_1.SetConditionPacket(data);
                break;
            case packet_1.PacketType.SHOOTACK:
                packet = new shootack_packet_1.ShootAckPacket(data);
                break;
            case packet_1.PacketType.SQUAREHIT:
                packet = new square_hit_packet_1.SquareHitPacket(data);
                break;
            case packet_1.PacketType.TELEPORT:
                packet = new teleport_packet_1.TeleportPacket(data);
                break;
            case packet_1.PacketType.UPDATEACK:
                packet = new updateack_packet_1.UpdateAckPacket(data);
                break;
            case packet_1.PacketType.USEITEM:
                packet = new use_item_packet_1.UseItemPacket(data);
                break;
            case packet_1.PacketType.USEPORTAL:
                packet = new use_portal_packet_1.UsePortalPacket(data);
                break;
        }
        packet.type = type;
        return packet;
    }
}
exports.Packets = Packets;
