import StatusBadge from "../ui/StatusBadge"
import SectionCard from "../ui/SectionCard"

export default function ProfilePage({
    profile,
    setProfile,
    profileStatus,
    setProfileStatus,
    handleAvatarUpload,
    handleSaveProfile,
    activeTheme,
}) {
    return (
        <section className="mx-auto mt-10 max-w-3xl px-6">
            <SectionCard activeTheme={activeTheme}>
                <h2 className={`text-2xl font-semibold ${activeTheme.primaryText}`}>Profile</h2>

                <div className="mt-4">
                    <div className={`text-sm ${activeTheme.mutedText}`}>Current nickname</div>
                    <div className={`mb-4 text-lg ${activeTheme.primaryText}`}>
                        {profile?.nickname || "Anonymous"}
                    </div>

                    <input
                        type="text"
                        value={profile?.nickname || ""}
                        onChange={(e) =>
                            setProfile((current) => ({
                                ...current,
                                nickname: e.target.value,
                            }))
                        }
                        maxLength={30}
                        placeholder="Enter new nickname"
                        className={`w-full rounded-xl border ${activeTheme.inputBorder} ${activeTheme.inputBg} px-4 py-2 ${activeTheme.primaryText} outline-none`}
                    />

                    <div className="mt-4">
                        <div className={`text-sm ${activeTheme.mutedText}`}>Avatar image URL</div>

                        <input
                            type="text"
                            value={profile?.avatar_url || ""}
                            onChange={(e) =>
                                setProfile((current) => ({
                                    ...current,
                                    avatar_url: e.target.value,
                                }))
                            }
                            placeholder="Paste an image URL..."
                            className={`mt-2 w-full rounded-xl border ${activeTheme.inputBorder} ${activeTheme.inputBg} px-4 py-2 ${activeTheme.primaryText} outline-none`}
                        />

                        <label className={`mt-3 inline-flex cursor-pointer items-center rounded-xl bg-gradient-to-r ${activeTheme.button} px-4 py-2 text-sm font-medium ${activeTheme.buttonText} transition`}>
                            Upload avatar from device
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    handleAvatarUpload(e.target.files?.[0])
                                }}
                                className="hidden"
                            />
                        </label>

                        {profile?.avatar_url ? (
                            <img
                                src={profile.avatar_url}
                                alt="Profile avatar preview"
                                className={`mt-4 h-20 w-20 rounded-full border ${activeTheme.inactiveBorder} object-cover`}
                            />
                        ) : null}
                    </div>

                    <div className="mt-6">
                        <div className={`text-sm ${activeTheme.mutedText}`}>Theme</div>

                        <select
                            value={profile?.theme || "emerald"}
                            onChange={(e) =>
                                setProfile((current) => ({
                                    ...current,
                                    theme: e.target.value,
                                }))
                            }
                            className={`mt-2 w-full rounded-xl border ${activeTheme.inputBorder} ${activeTheme.inputBg} px-4 py-2 ${activeTheme.primaryText} outline-none`}
                        >
                            <option value="emerald">Emerald</option>
                            <option value="ocean">Ocean</option>
                            <option value="purple">Purple</option>
                            <option value="rose">Rose</option>
                            <option value="amber">Amber</option>
                            <option value="yosemite">Yosemite</option>
                            <option value="atari">Atari</option>
                        </select>
                    </div>

                    <button
                        onClick={handleSaveProfile}
                        className={`mt-6 rounded-xl bg-gradient-to-r ${activeTheme.button} px-4 py-2 ${activeTheme.buttonText} transition`}
                    >
                        Save Profile
                    </button>

                    {profileStatus ? (
                        <div className="mt-3">
                            <StatusBadge activeTheme={activeTheme}>
                                {profileStatus}
                            </StatusBadge>
                        </div>
                    ) : null}
                </div>
            </SectionCard>
        </section>
    )
}