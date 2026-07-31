<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminUserRequest;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Http\Request;

class UserController extends Controller
{
    protected UserRepositoryInterface $userRepo;

    public function __construct(UserRepositoryInterface $userRepo)
    {
        $this->userRepo = $userRepo;
    }

    public function index(Request $request)
    {
        $users = $this->userRepo->getPaginated(20, $request->only(['search', 'role']));

        return response()->json([
            'success' => true,
            'data'    => $users,
        ]);
    }

    public function store(AdminUserRequest $request)
    {
        $user = $this->userRepo->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Tạo tài khoản người dùng thành công.',
            'data'    => $user,
        ], 201);
    }

    public function show(int $id)
    {
        $user = $this->userRepo->findById($id);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Người dùng không tồn tại.'], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $user,
        ]);
    }

    public function update(AdminUserRequest $request, int $id)
    {
        $user = $this->userRepo->findById($id);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Người dùng không tồn tại.'], 404);
        }

        $this->userRepo->update($user, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật thông tin người dùng thành công.',
            'data'    => $user->fresh(),
        ]);
    }

    public function destroy(int $id)
    {
        $user = $this->userRepo->findById($id);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Người dùng không tồn tại.'], 404);
        }

        $this->userRepo->delete($user);

        return response()->json([
            'success' => true,
            'message' => 'Đã xoá tài khoản người dùng.',
        ]);
    }
}
